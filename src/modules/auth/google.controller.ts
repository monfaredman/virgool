import { AuthService } from 'src/modules/auth/auth.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth/google')
@ApiTags('Google Auth')
@UseGuards(AuthGuard('google'))
export class GoogleAuthController {
  constructor(private authService: AuthService) {}

  @Get()
  googleLogin(@Req() req) {
    return req.user;
  }

  @Get('redirect')
  googleRedirect(@Req() req) {
    const userData = req.user;
    return this.authService.googleAuth(userData);
  }
}
