import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { ProfileDto } from './dto/profile.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { isDate } from 'class-validator';
import { Gender } from './enums/gender.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async changeProfile(profileDto: ProfileDto) {
    const { id: userId, profileId } = this.request.user;
    let profile = await this.profileRepository.findOneBy({ userId });
    const {
      bio,
      birthday,
      gender,
      image_profile,
      linkedin_profile,
      nick_name,
      x_profile,
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
      profile = await this.profileRepository.save(profile);
    } else {
      profile = this.profileRepository.create({
        bio,
        birthday,
        gender,
        image_profile,
        linkedin_profile,
        nick_name,
        x_profile,
        userId,
      });
    }
    profile = await this.profileRepository.save(profile);
    if (!profileId) {
      await this.userRepository.update(
        { id: userId },
        { profileId: profile.id },
      );
    }
  }
}
