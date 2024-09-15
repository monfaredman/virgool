import { ApiPropertyOptional } from '@nestjs/swagger';
import { Length } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class ProfileDto {
  @ApiPropertyOptional({ nullable: true })
  @Length(3, 100)
  nick_name: string;
  @ApiPropertyOptional({ nullable: true })
  @Length(10, 200)
  bio: string;
  @ApiPropertyOptional({ nullable: true, type: 'string', format: 'binary' })
  image_profile: string;
  @ApiPropertyOptional({ nullable: true, type: 'string', format: 'binary' })
  bg_profile: string;
  @ApiPropertyOptional({ nullable: true, enum: Gender })
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
