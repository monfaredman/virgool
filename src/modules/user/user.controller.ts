import { Controller, Body, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum.';
@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/profile')
  @ApiConsumes(SwaggerConsumes.MultipartData)
  changeProfile(@Body() profileDto: ProfileDto) {
    return this.userService.changeProfile(profileDto);
  }
}
