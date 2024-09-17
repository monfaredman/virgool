import { AuthService } from './../auth/auth.service';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { ProfileDto } from './dto/profile.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { isDate } from 'class-validator';
import { Gender } from './enums/gender.enum';
import { ProfileImage } from './types/files';
import {
  AuthMessage,
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
  BadRequestMessage,
} from 'src/common/enums/message.enum';
import { TokenService } from '../auth/tokens.service';
import { OTPEntity } from './entities/otp.entity';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthMethod } from '../auth/enums/method.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OTPEntity)
    private otpRepository: Repository<OTPEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @Inject(REQUEST) private request: Request,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  async changeProfile(files: ProfileImage, profileDto: ProfileDto) {
    if (files?.image_profile?.length > 0) {
      const [image] = files?.image_profile;
      profileDto.image_profile = image?.['path']?.slice(7);
    }
    if (files?.bg_image?.length > 0) {
      const [image] = files?.bg_image;
      profileDto.bg_image = image?.['path']?.slice(7);
    }
    const { id: userId, profileId } = this.request.user;
    let profile = await this.profileRepository.findOneBy({ userId });
    const {
      bio,
      birthday,
      gender,
      linkedin_profile,
      nick_name,
      x_profile,
      image_profile,
      bg_image,
    } = profileDto;
    if (profile) {
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday))) profile.birthday = birthday;
      if (gender && Object.values(Gender).includes(gender as Gender))
        profile.gender = gender;
      if (image_profile) profile.image_profile = image_profile;
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
      if (nick_name) profile.nick_name = nick_name;
      if (x_profile) profile.x_profile = x_profile;
      if (image_profile) profile.image_profile = image_profile;
      if (bg_image) profile.bg_image = bg_image;
      profile = await this.profileRepository.save(profile);
    } else {
      const profileData = {
        bio,
        birthday,
        gender,
        linkedin_profile,
        nick_name,
        x_profile,
        userId,
      };
      profile = this.profileRepository.create(profileData);
    }
    profile = await this.profileRepository.save(profile);
    if (!profileId) {
      await this.userRepository.update(
        { id: userId },
        { profileId: profile.id },
      );
    }
    return {
      message: PublicMessage.Updated,
    };
  }

  async getProfile() {
    const { id } = this.request.user;
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }
  async changeEmail(email: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ email });
    if (user && user.id !== id) {
      throw new ConflictException(ConflictMessage.EmailExistence);
    } else if (user && user.id === id) {
      return {
        message: PublicMessage.Updated,
      };
    }
    await this.userRepository.update({ id }, { new_email: email });
    const otp = await this.authService.createOtpForUser(id, AuthMethod.Email);
    const token = this.tokenService.createEmailToken({ email });
    return {
      code: otp.code,
      token,
    };
  }

  async verifyEmail(code: string) {
    const { id: userId, new_email } = this.request.user;
    const token = this.request.cookies?.[CookieKeys.EmailOTP];
    if (!token) throw new BadRequestException(AuthMessage.ExpiresCode);
    const { email } = this.tokenService.verifyEmailToken(token);
    if (email !== new_email)
      throw new BadRequestException(BadRequestMessage.SomethingWrong);
    const otp = await this.checkOtp(userId, code);
    if (otp.otp.method !== AuthMethod.Email)
      throw new BadRequestException(BadRequestMessage.SomethingWrong);
    await this.userRepository.update(
      { id: userId },
      { email, verify_email: true, new_email: null },
    );
    return {
      message: PublicMessage.Updated,
    };
  }

  async changePhone(phone: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ phone });
    if (user && user.id !== id) {
      throw new ConflictException(ConflictMessage.PhoneExistence);
    } else if (user && user.id === id) {
      return {
        message: PublicMessage.Updated,
      };
    }
    await this.userRepository.update({ id }, { new_phone: phone });
    const otp = await this.authService.createOtpForUser(id, AuthMethod.Phone);
    const token = this.tokenService.createPhoneToken({ phone });
    return {
      code: otp.code,
      token,
    };
  }

  async verifyPhone(code: string) {
    const { id: userId, new_phone } = this.request.user;
    const token = this.request.cookies?.[CookieKeys.PhoneOTP];
    if (!token) throw new BadRequestException(AuthMessage.ExpiresCode);
    const { phone } = this.tokenService.verifyPhoneToken(token);
    if (phone !== new_phone)
      throw new BadRequestException(BadRequestMessage.SomethingWrong);
    const otp = await this.checkOtp(userId, code);
    if (otp.otp.method !== AuthMethod.Phone)
      throw new BadRequestException(BadRequestMessage.SomethingWrong);
    await this.userRepository.update(
      { id: userId },
      { phone, verify_phone: true, new_phone: null },
    );
    return {
      message: PublicMessage.Updated,
    };
  }

  async checkOtp(userId: number, code: string) {
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new BadRequestException(NotFoundMessage.OtpNotFound);
    const now = new Date();
    if (otp.expiresIn < now)
      throw new BadRequestException(AuthMessage.ExpiresCode);
    if (otp.code !== +code)
      throw new BadRequestException(AuthMessage.WrongCode);
    return { otp };
  }

  async changeUsername(username: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ username });
    if (user && user.id !== id) {
      throw new ConflictException(ConflictMessage.UsernameExistence);
    } else if (user && user.id === id) {
      return {
        message: PublicMessage.Updated,
      };
    }
    await this.userRepository.update({ id }, { username });
    return {
      message: PublicMessage.Updated,
    };
  }
}
