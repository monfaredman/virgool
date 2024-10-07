import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    if (!profile) {
      throw new Error('Profile is undefined');
    }

    const { name, emails, photos } = profile || {};
    const email = emails?.[0]?.value;
    const firstName = name?.givenName || null;
    const lastName = name?.familyName || null;
    const picture = photos?.[0]?.value || null;

    const user = {
      email,
      firstName,
      lastName,
      picture,
    };

    return user;
  }
}
