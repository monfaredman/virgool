import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function SwaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setBasePath('Virgool')
    .setDescription('The Virgool API description')
    .setTitle('Virgool API')
    .setVersion('1.0')
    .addBearerAuth(SwaggerAuthConfig(), 'Authorization')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('/swagger', app, swaggerDoc);
}

function SwaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',
    name: 'Authorization',
  };
}
