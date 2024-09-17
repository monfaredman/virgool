import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';
import { ValidationMessage } from 'src/common/enums/message.enum';

export class ProfileDto {
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @Length(3, 100)
  nick_name: string;
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @Length(10, 200)
  bio: string;
  @ApiPropertyOptional({ nullable: true, type: 'string', format: 'binary' })
  image_profile: string;
  @ApiPropertyOptional({ nullable: true, type: 'string', format: 'binary' })
  bg_image: string;
  @ApiPropertyOptional({ nullable: true, enum: Gender })
  @IsOptional()
  gender: string;
  @ApiPropertyOptional({
    nullable: true,
    example: '1999-12-31T23:59:59',
    format: 'date-time',
  })
  birthday: string;
  @ApiPropertyOptional({ nullable: true })
  linkedin_profile: string;
  @ApiPropertyOptional({ nullable: true })
  x_profile: string;
}
export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail({}, { message: ValidationMessage.InvalidEmailFormat })
  email: string;
}
export class ChangePhoneDto {
  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: ValidationMessage.InvalidPhoneFormat })
  phone: string;
}
export class ChangeUsernameDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  username: string;
}
