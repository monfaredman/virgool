import { Injectable } from '@nestjs/common';
import { AuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  userExistence(authDto: AuthDto) {
    return authDto;
  }
}
