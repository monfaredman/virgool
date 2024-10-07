import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enum';
import { AuthMethod } from './enums/method.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ProfileEntity } from '../user/entities/profile.entity';
import { Repository } from 'typeorm';
import {
  AuthMessage,
  BadRequestMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { OTPEntity } from '../user/entities/otp.entity';
import { randomInt } from 'crypto';
import { TokenService } from './tokens.service';
import { Response, Request } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthResponse, GoogleUser } from './types/response';
import { REQUEST } from '@nestjs/core';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import { KavenegarService } from '../http/kavenegar.service';
import { randomId } from 'src/common/utils/functions.util';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OTPEntity)
    private otpRepository: Repository<OTPEntity>,
    private tokenService: TokenService,
    @Inject(REQUEST) private request: Request,
    private kavenegarService: KavenegarService,
  ) {}
  async sendOtp(method: AuthMethod, username: string, code: number) {
    if (method === AuthMethod.Email) {
      //SendEmail
    } else if (method === AuthMethod.Phone) {
      //SendSms
      this.kavenegarService.sendVerificationSms(username, code);
    }
  }
  async userExistence(authDto: AuthDto, res: Response) {
    const { method, type, username } = authDto;
    let result: AuthResponse;
    switch (type) {
      case AuthType.Login:
        result = await this.login(method, username);
        // await this.sendOtp(method, username, result.code);
        return this.sendResponse(res, result);
      case AuthType.Register:
        result = await this.register(method, username);
        // await this.sendOtp(method, username, result.code);
        return this.sendResponse(res, result);

      default:
        throw new UnauthorizedException('Invalid type');
    }
  }

  async login(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    const user: UserEntity = await this.checkExistUser(method, validUsername);
    if (!user) throw new UnauthorizedException(AuthMessage.UserNotFound);
    const otp = await this.createOtpForUser(user.id, method);
    const token = this.tokenService.createOtpToken({ userId: user.id });

    return {
      code: otp.code,
      message: PublicMessage.SentOtp,
      token,
    };
  }
  async register(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    console.log(validUsername);
    let user: UserEntity = await this.checkExistUser(method, validUsername);
    console.log(user);
    if (user) throw new ConflictException(AuthMessage.UserExistence);
    // if (method === AuthMethod.Username) {
    //   throw new BadRequestException(BadRequestMessage.InValidRegister);
    // }
    user = this.userRepository.create({ [method]: username });
    user = await this.userRepository.save(user);
    console.log(user);
    user.username = `m_${user.id}`;
    user = await this.userRepository.save(user);
    const otp = await this.createOtpForUser(user.id, method);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    console.log(token);

    return {
      code: otp.code,
      message: PublicMessage.SentOtp,
      token,
    };
  }

  usernameValidator(method: AuthMethod, username: string) {
    switch (method) {
      case AuthMethod.Email:
        if (isEmail(username)) return username;
        throw new BadRequestException('Invalid email');
      case AuthMethod.Phone:
        if (isMobilePhone(username, 'fa-IR')) return username;
        throw new BadRequestException('Invalid phone number');
      case AuthMethod.Username:
        return username;
      default:
        throw new UnauthorizedException('Invalid method');
    }
  }
  async checkExistUser(method: AuthMethod, username: string) {
    let user: UserEntity;
    switch (method) {
      case AuthMethod.Email:
        user = await this.userRepository.findOneBy({ email: username });
        break;
      case AuthMethod.Phone:
        user = await this.userRepository.findOneBy({ phone: username });
        break;
      case AuthMethod.Username:
        user = await this.userRepository.findOneBy({ username });
        break;
      default:
        throw new BadRequestException(BadRequestMessage.InValidLogin);
    }
    return user;
  }

  async sendResponse(res: Response, result: AuthResponse) {
    // const { token } = result;
    const { token, code } = result;
    res.cookie(CookieKeys.OTP, token, CookiesOptionsToken());
    res.json({ message: PublicMessage.SentOtp, code });
  }

  async createOtpForUser(userId: number, method: AuthMethod) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    let otp = await this.otpRepository.findOneBy({ userId });
    let existOtp;
    if (otp) {
      if (otp.expiresIn > new Date()) {
        throw new BadRequestException(AuthMessage.NotExpiresCode);
      }
      existOtp = true;
      otp.code = +code;
      otp.expiresIn = expiresIn;
      otp.method = method;
    } else {
      otp = this.otpRepository.create({
        code: +code,
        expiresIn,
        userId,
        method,
      });
    }
    otp = await this.otpRepository.save(otp);
    if (!existOtp) {
      await this.userRepository.update({ id: userId }, { otpId: otp.id });
    }
    return otp;
    //Send [Sms, Email, Notification, ...] OtpCode
  }

  async checkOtp(code: string) {
    const token = this.request.cookies?.[CookieKeys.OTP];
    if (!token) throw new UnauthorizedException(AuthMessage.ExpiresCode);
    const { userId } = this.tokenService.verifyOtpToken(token);
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new UnauthorizedException(AuthMessage.LoginAgain);
    const now = new Date();
    if (otp.expiresIn < now)
      throw new UnauthorizedException(AuthMessage.ExpiresCode);
    if (otp.code !== +code)
      throw new UnauthorizedException(AuthMessage.WrongCode);
    const accessToken = this.tokenService.createAccessToken({ userId });
    if (otp.method === AuthMethod.Email) {
      await this.userRepository.update({ id: userId }, { verify_email: true });
    } else if (otp.method === AuthMethod.Phone) {
      await this.userRepository.update({ id: userId }, { verify_phone: true });
    }
    return {
      message: PublicMessage.LoggedIn,
      accessToken,
    };
  }

  async validateAccessToken(token: string) {
    const { userId } = this.tokenService.verifyAccessToken(token);
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);
    return user;
  }

  async googleAuth(userData: GoogleUser) {
    const { email, firstName, lastName } = userData;
    let token: string;
    let user = await this.userRepository.findOneBy({ email });
    console.log('user', user);
    if (user) {
      console.log('user');
      token = this.tokenService.createOtpToken({ userId: user?.id });
    } else {
      user = await this.userRepository.create({
        email,
        verify_email: true,
        username: email.split('@')['0'] + randomId(),
      });
      user = await this.userRepository.save(user);
      let profile = this.profileRepository.create({
        userId: user?.id,
        nick_name: `${firstName} ${lastName}`,
      });
      profile = await this.profileRepository.save(profile);
      user.profileId = profile?.id;
      await this.userRepository.save(user);
      token = this.tokenService.createAccessToken({ userId: user?.id });
    }
    return { message: PublicMessage.LoggedIn, token };
  }
}
