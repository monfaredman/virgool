import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);
  app.use(cookieParser(process.env.COOKIE_SECRET));
  const PORT = process.env.PORT;
  await app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    console.log(`Swagger is running on http://localhost:${PORT}/swagger`);
  });
}

bootstrap();
