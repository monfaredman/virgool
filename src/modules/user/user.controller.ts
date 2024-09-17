import {
  Controller,
  Body,
  Put,
  UseInterceptors,
  UseGuards,
  Get,
  Patch,
  Res,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  ChangeEmailDto,
  ChangePhoneDto,
  ChangeUsernameDto,
  ProfileDto,
} from './dto/profile.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum.';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage } from 'src/common/utils/multer.util';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProfileImage } from './types/files';
import { UploadedOtionalFiles } from 'src/common/decorators/upload-file.decorator';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { Response } from 'express';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import { PublicMessage } from 'src/common/enums/message.enum';
import { CheckOtpDto } from '../auth/dto/auth.dto';
@Controller('user')
@ApiTags('User')
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/profile')
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image_profile', maxCount: 1 },
        { name: 'bg_image', maxCount: 1 },
      ],
      {
        storage: multerStorage('user-profile'),
      },
    ),
  )
  changeProfile(
    @UploadedOtionalFiles()
    files: ProfileImage,
    @Body()
    profileDto: ProfileDto,
  ) {
    return this.userService.changeProfile(files, profileDto);
  }

  @Get('/profile')
  getProfile() {
    return this.userService.getProfile();
  }

  @Patch('/change-email')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changeEmail(
      emailDto.email,
    );
    if (message) return res.json({ message });
    res.cookie(CookieKeys.EmailOTP, token, CookiesOptionsToken());
    res.json({ code, message: PublicMessage.SentOtp });
  }

  @Post('/verify-email-otp')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async verifyEmail(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyEmail(otpDto.code);
  }
  @Patch('/change-phone')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changePhone(@Body() phoneDto: ChangePhoneDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changePhone(
      phoneDto.phone,
    );
    if (message) return res.json({ message });
    res.cookie(CookieKeys.PhoneOTP, token, CookiesOptionsToken());
    res.json({ code, message: PublicMessage.SentOtp });
  }

  @Post('/verify-phone-otp')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async verifyPhone(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyPhone(otpDto.code);
  }

  @Patch('/change-username')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeUsername(@Body() usernameDto: ChangeUsernameDto) {
    return this.userService.changeUsername(usernameDto.username);
  }
}
