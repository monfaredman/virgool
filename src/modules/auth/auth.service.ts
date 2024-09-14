import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileEntity: Repository<ProfileEntity>,
    @InjectRepository(OTPEntity)
    private otpRepository: Repository<OTPEntity>,
    private tokenService: TokenService,
  ) {}

  userExistence(authDto: AuthDto) {
    const { method, type, username } = authDto;
    switch (type) {
      case AuthType.Login:
        return this.login(method, username);
        break;
      case AuthType.Register:
        return this.register(method, username);
        break;

      default:
        throw new UnauthorizedException('Invalid type');
        break;
    }
  }

  async login(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    const user: UserEntity = await this.checkExistUser(method, validUsername);
    if (!user) throw new UnauthorizedException(AuthMessage.UserNotFound);
    const otp = await this.createOtpForUser(user.id);
    // user.otpId = otp.id;
    // await this.userRepository.save(user);
    return {
      code: otp.code,
      message: PublicMessage.SentOtp,
      userId: user.id,
    };
  }
  async register(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    let user: UserEntity = await this.checkExistUser(method, validUsername);
    if (user) throw new ConflictException(AuthMessage.UserExistence);
    if (method === AuthMethod.Username) {
      throw new BadRequestException(BadRequestMessage.InValidRegister);
    }
    user = this.userRepository.create({ [method]: username });
    user = await this.userRepository.save(user);
    user.username = `m_${user.id}`;
    user = await this.userRepository.save(user);
    const otp = await this.createOtpForUser(user.id);
    return {
      code: otp.code,
      message: PublicMessage.SentOtp,
      userId: user.id,
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

  // async sendAndSaveOtp(userId: number) {
  //   const { mobile } = otpDto;
  //   let user = await this.userRepository.findOneBy({ mobile });
  //   if (!user) {
  //     user = this.userRepository.create({
  //       mobile,
  //     });
  //     user = await this.userRepository.save(user);
  //   }
  //   await this.createOtpForUser(user);
  //   return {
  //     message: 'otp sent successfully',
  //   };
  // }

  async createOtpForUser(userId: number) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    let otp = await this.otpRepository.findOneBy({ userId });
    let existOtp;
    if (otp) {
      if (otp.expiresIn > new Date()) {
        throw new BadRequestException('otp is not expired yet');
      }
      existOtp = true;
      otp.code = +code;
      otp.expiresIn = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code: +code,
        expiresIn,
        userId,
      });
    }
    otp = await this.otpRepository.save(otp);
    if (!existOtp) {
      await this.userRepository.update({ id: userId }, { otpId: otp.id });
    }
    return otp;
    //Send [Sms, Email, Notification, ...] OtpCode
  }

  // async checkOtp(otpDto: CheckOtpDto) {
  //   const { code, mobile } = otpDto;
  //   const now = new Date();
  //   const user = await this.userRepository.findOne({
  //     where: { mobile },
  //     relations: ['otp'],
  //   });
  //   if (!user || !user?.otp) {
  //     throw new UnauthorizedException('user not found');
  //   }
  //   const otp = user?.otp;
  //   if (otp?.code !== +code) {
  //     throw new UnauthorizedException('code is not valid');
  //   }
  //   if (otpDto.expires_in < now) {
  //     throw new UnauthorizedException('otp is expired');
  //   }
  //   if (!user.mobile_verify) {
  //     await this.userRepository.update(
  //       { id: user.id },
  //       { mobile_verify: true },
  //     );
  //   }
  //   const { accessToken, refreshToken } = this.generateTokenOfUser({
  //     id: user.id,
  //     mobile: +mobile,
  //   });
  //   return {
  //     accessToken,
  //     refreshToken,
  //     messagage: 'user is verified successfully',
  //   };
  // }

  // generateTokenOfUser(payload: TokenPayload) {
  //   const accessToken = this.jwtService.sign(
  //     {
  //       id: payload.id,
  //       mobile: payload.mobile,
  //     },
  //     {
  //       secret: this.configService.get('Jwt.accessTokenSecret'),
  //       expiresIn: '30d',
  //     },
  //   );
  //   const refreshToken = this.jwtService.sign(
  //     {
  //       id: payload.id,
  //       mobile: payload.mobile,
  //     },
  //     {
  //       secret: this.configService.get('Jwt.refreshTokenSecret'),
  //       expiresIn: '1y',
  //     },
  //   );
  //   return { accessToken, refreshToken };
  // }

  // async validateAccessToken(token: string | boolean) {
  //   try {
  //     if (typeof token === 'string') {
  //       const payload = this.jwtService.verify<TokenPayload>(token, {
  //         secret: this.configService.get('Jwt.accessTokenSecret'),
  //       });
  //       if (typeof payload === 'object' && payload.hasOwnProperty('id')) {
  //         const user = await this.userRepository.findOneBy({ id: payload.id });
  //         if (!user) {
  //           throw new UnauthorizedException('user not found');
  //         }
  //         return user;
  //       }
  //     }
  //     throw new UnauthorizedException('invalid token');
  //   } catch (e) {
  //     throw new UnauthorizedException('invalid token');
  //   }
  // }

  // async hashPasswrod(password: string) {
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(password, salt);
  //   return hashedPassword;
  // }

  // async checkEmailIsExist(email: string) {
  //   const user = await this.userRepository.findOneBy({ email });
  //   if (user) throw new ConflictException('Email already exists');
  // }

  // async checkMobileIsExist(mobile: string) {
  //   const user = await this.userRepository.findOneBy({ mobile });
  //   if (user) throw new ConflictException('Mobile already exists');
  // }
}
