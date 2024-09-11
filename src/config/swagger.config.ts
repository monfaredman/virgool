import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function SwaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setBasePath('Virgool')
    .setDescription('The Virgool API description')
    .setTitle('Virgool API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('/swagger', app, swaggerDoc);
}
