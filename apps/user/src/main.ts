import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { userProtoPath } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: userProtoPath
      }
    }
  );
  await app.listen();
}
bootstrap();
