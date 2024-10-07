import { AuthService } from './../auth/auth.service';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
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
import { FollowEntity } from './entities/follow.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utils/pagination.util';
import { UserBlockDto } from '../auth/dto/auth.dto';
import { UserStatus } from './enums/status.enum';

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
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
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
    const { id: userId, profileId } = this.request.user as UserEntity;
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

  async find() {
    return this.userRepository.find({
      where: {},
    });
  }
  async getProfile() {
    const { id } = this.request.user as UserEntity;
    return this.userRepository
      .createQueryBuilder(EntityName.User)
      .where({ id })
      .leftJoinAndSelect('user.profile', 'profile')
      .loadRelationCountAndMap('user.followers', 'user.followers')
      .loadRelationCountAndMap('user.following', 'user.following')
      .getOne();
  }
  async changeEmail(email: string) {
    const { id } = this.request.user as UserEntity;
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
    const { id: userId, new_email } = this.request.user as UserEntity;
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
    const { id } = this.request.user as UserEntity;
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
    const { id: userId, new_phone } = this.request.user as UserEntity;
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
    const { id } = this.request.user as UserEntity;
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
  async followToggle(followingId: number) {
    const { id: userId } = this.request.user as UserEntity;
    const following = await this.userRepository.findOneBy({ id: followingId });
    if (!following) throw new NotFoundException(NotFoundMessage.UserNotFound);

    const isFollowed = await this.followRepository.findOneBy({
      followingId,
      followerId: userId,
    });
    let message = PublicMessage.Followed;
    if (isFollowed) {
      message = PublicMessage.UnFollowed;
      await this.followRepository.remove(isFollowed);
    } else {
      await this.followRepository.insert({ followingId, followerId: userId });
    }
    return {
      message,
    };
  }
  async followers(paginationDto: PaginationDto) {
    const { id: userId } = this.request.user as UserEntity;
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [followers, count] = await this.followRepository.findAndCount({
      where: { followingId: userId },
      relations: {
        follower: {
          profile: true,
        },
      },
      select: {
        id: true,
        follower: {
          id: true,
          username: true,
          profile: {
            id: true,
            nick_name: true,
            image_profile: true,
            bg_image: true,
            bio: true,
          },
        },
      },
      skip,
      take: limit,
    });
    return {
      pagination: paginationGenerator(count, limit, page),
      followers,
    };
  }
  async following(paginationDto: PaginationDto) {
    const { id: userId } = this.request.user as UserEntity;
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [following, count] = await this.followRepository.findAndCount({
      where: { followerId: userId },
      relations: {
        following: {
          profile: true,
        },
      },
      select: {
        id: true,
        following: {
          id: true,
          username: true,
          profile: {
            id: true,
            nick_name: true,
            image_profile: true,
            bg_image: true,
            bio: true,
          },
        },
      },
      skip,
      take: limit,
    });
    return {
      pagination: paginationGenerator(count, limit, page),
      following,
    };
  }
  async blockToggle(blockDto: UserBlockDto) {
    const { userId } = blockDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(NotFoundMessage.UserNotFound);
    let message = PublicMessage.Blocked;
    if (user.status === UserStatus.Block) {
      await this.userRepository.update({ id: userId }, { status: null });
    } else {
      message = PublicMessage.UnBlocked;
      await this.userRepository.update(
        { id: userId },
        { status: UserStatus.Block },
      );
    }
    return {
      message,
    };
  }
}
