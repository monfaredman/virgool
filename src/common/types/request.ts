import { UserEntity } from 'src/modules/user/entities/user.entity';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}
