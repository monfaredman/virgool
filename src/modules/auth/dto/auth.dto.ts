import { ApiProperty } from '@nestjs/swagger';
import { AuthType } from '../enums/type.enum';
import { IsEmail, IsEnum, Length } from 'class-validator';
import { AuthMethod } from '../enums/method.enum';

export class AuthDto {
  @ApiProperty()
  @IsEmail()
  @Length(3, 100)
  username: string;
  @ApiProperty({ enum: AuthType })
  @IsEnum(AuthType)
  type: string;
  @ApiProperty({ enum: AuthMethod })
  @IsEnum(AuthMethod)
  method: AuthMethod;
}
