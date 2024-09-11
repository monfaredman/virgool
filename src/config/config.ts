import { registerAs } from '@nestjs/config';

export enum ConfigKeys {
  App = 'App',
  Db = 'Db',
  Jwt = 'Jwt',
}

const AppConfig = registerAs(ConfigKeys.App, () => ({
  port: 3000,
}));
const JwtConfig = registerAs(ConfigKeys.Jwt, () => ({
  accessTokenSecret: '0f4d1684aec62727d350386415e0f3f35849690a',
  refreshTokenSecret: 'dc479bb02d0b63803793a2114d8ffcaa188cd787',
}));

const DbConfig = registerAs(ConfigKeys.Db, () => ({
  port: 5432,
  host: 'localhost',
  username: 'postgres',
  password: 'monfaredman',
  database: 'auth-otp',
}));

export const configurations = [AppConfig, DbConfig, JwtConfig];
