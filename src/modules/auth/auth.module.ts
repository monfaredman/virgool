import { ProfileEntity } from './../user/entities/profile.entity';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTPEntity } from '../user/entities/otp.entity';
import { UserEntity } from '../user/entities/user.entity';
import { GoogleAuthController } from './google.controller';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OTPEntity, ProfileEntity])],
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, JwtService, TokenService, GoogleStrategy],
  exports: [AuthService, JwtService, TokenService, GoogleStrategy],
})
export class AuthModule {}
