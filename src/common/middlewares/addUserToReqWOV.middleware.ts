import { Injectable, NestMiddleware } from '@nestjs/common';
import { isJWT } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class AddUserToReqWOV implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractToken(req);
    if (!token) {
      return next();
    }
    try {
      const user = await this.authService.validateAccessToken(token);
      if (user) req.user = user;
    } catch (error) {
      console.log(error);
    }
    next();
  }

  protected extractToken(request: Request): string {
    const { authorization } = request.headers;
    if (
      !authorization ||
      (typeof authorization === 'string' && authorization.trim() === '')
    ) {
      return null;
    }
    const [bearer, token] = authorization?.split(' ');
    if (bearer?.toLocaleLowerCase() !== 'bearer' || !token || !isJWT(token)) {
      return null;
    }
    return token;
  }
}
