import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { authGrpcOption, ShareConfig } from '@app/shared';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(AuthModule);
  const { host, port } = context
    .get(ConfigService)
    .get<ShareConfig['auth_grpc']>('auth_grpc');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        ...authGrpcOption,
        url: `${host}:${port}`
      }
    }
  );

  await app.listen();
}
bootstrap();
