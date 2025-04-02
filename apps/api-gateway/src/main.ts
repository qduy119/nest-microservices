import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import {
  CatchAllExceptionFilter,
  LoggerFactory,
  ShareConfig
} from '@app/shared';
import { AppConfig } from './config';
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
  app.useGlobalFilters(new CatchAllExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('E-commerce microservice projects')
    .setDescription('NestJS API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'api/swagger/json'
  });

  const configService = app.get(ConfigService);
  const PORT = configService.get<AppConfig['http']>('http').port;
  const LOG_LEVEL = configService.get<ShareConfig['app']>('app').log_level;

  app.useLogger(LoggerFactory('NestApiGateway', LOG_LEVEL));

  await app.listen(PORT);
}
bootstrap();
