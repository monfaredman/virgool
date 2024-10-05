import { ApiProperty } from '@nestjs/swagger';
import { AuthType } from '../enums/type.enum';
import { IsEnum, IsNumberString, IsString, Length } from 'class-validator';
import { AuthMethod } from '../enums/method.enum';

export class AuthDto {
  @ApiProperty()
  @Length(3, 100)
  username: string;
  @ApiProperty({ enum: AuthType })
  @IsEnum(AuthType)
  type: string;
  @ApiProperty({ enum: AuthMethod })
  @IsEnum(AuthMethod)
  method: AuthMethod;
}
export class CheckOtpDto {
  @ApiProperty()
  @IsString()
  @Length(5, 5)
  code: string;
}
export class UserBlockDto {
  @ApiProperty()
  @IsNumberString()
  userId: number;
}
