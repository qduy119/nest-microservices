import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ShareConfig, userGrpcOption } from '@app/shared';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(UserModule);
  const { host, port } = context
    .get(ConfigService)
    .get<ShareConfig['user_grpc']>('user_grpc');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.GRPC,
      options: {
        ...userGrpcOption,
        url: `${host}:${port}`
      }
    }
  );

  await app.listen();
}
bootstrap();
