import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppConfig } from './config';
import { HttpExceptionFilter } from './exception';
import { LoggerFactory } from '@app/shared';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: '*',
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Authorization'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory(errors) {
        let errorMessages = {};
        errors.forEach((error) => {
          const constraints = error.constraints;
          errorMessages = { ...errorMessages, ...constraints };
        });
        errorMessages = Object.values(errorMessages).join(', ');
        return new BadRequestException(errorMessages);
      }
    })
  );
  app.use(helmet());
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('API Gateway for a basic E-commerce project')
    .setDescription('NestJS API Documentation')
    .setVersion('1.0')
    .addTag('NestJS')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const PORT = configService.get<AppConfig['http']>('http').port;
  const LOG_LEVEL = configService.get<AppConfig['app']>('app').log_level;

  app.useLogger(LoggerFactory('NestApiGateway', LOG_LEVEL));

  await app.listen(PORT);
}
bootstrap();
