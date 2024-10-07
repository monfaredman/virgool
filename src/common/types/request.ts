import { UserEntity } from 'src/modules/user/entities/user.entity';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

declare module 'express-serve-static-core' {
  export interface Request {
    user?: UserEntity;
  }
}
