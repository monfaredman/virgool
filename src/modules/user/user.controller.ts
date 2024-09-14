import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from '../auth/dto/auth.dto';
@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/user-existance')
  userExistence(@Body() authDto: AuthDto) {
    return this.userService.userExistence(authDto);
  }
}
