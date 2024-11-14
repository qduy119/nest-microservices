import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LoggerFactory, userGrpcClientOption } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.GRPC,
      options: userGrpcClientOption
    }
  );

  const configService = app.get(ConfigService);
  const LOG_LEVEL = configService.get<AppConfig['app']>('app').log_level;
  app.useLogger(LoggerFactory('AuthService', LOG_LEVEL));

  await app.listen();
}
bootstrap();
