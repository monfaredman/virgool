import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export class ProfileImage {
  image_profile: MulterField[];
  bg_image: MulterField[];
}
