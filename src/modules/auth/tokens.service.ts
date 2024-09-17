import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenPayload,
  CookiePayload,
  EmailTokenPayload,
  PhoneTokenPayload,
} from './types/payload';
import { AuthMessage, BadRequestMessage } from 'src/common/enums/message.enum';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createOtpToken(payload: CookiePayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.OTP_TOKEN_SECRET,
      expiresIn: '2m',
    });
    return token;
  }
  verifyOtpToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.OTP_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException(AuthMessage.TryAgain);
    }
  }
  createAccessToken(payload: AccessTokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '1y',
    });
    return token;
  }
  verifyAccessToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException(AuthMessage.LoginAgain);
    }
  }
  createEmailToken(payload: EmailTokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.EMAIL_TOKEN_SECRET,
      expiresIn: '2m',
    });
    return token;
  }
  verifyEmailToken(token: string): EmailTokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.EMAIL_TOKEN_SECRET,
      });
    } catch {
      throw new BadRequestException(BadRequestMessage.SomethingWrong);
    }
  }
  createPhoneToken(payload: PhoneTokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.PHONE_TOKEN_SECRET,
      expiresIn: '2m',
    });
    return token;
  }
  verifyPhoneToken(token: string): PhoneTokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.PHONE_TOKEN_SECRET,
      });
    } catch {
      throw new BadRequestException(BadRequestMessage.SomethingWrong);
    }
  }
}
