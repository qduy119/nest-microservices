import { NestFactory } from '@nestjs/core';
import { UploadModule } from './upload.module';
import { ConfigService } from '@nestjs/config';
import { fileGrpcOption, ShareConfig } from '@app/shared';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(UploadModule);
  const { host, port } = context
    .get(ConfigService)
    .get<ShareConfig['file_grpc']>('file_grpc');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UploadModule,
    {
      transport: Transport.GRPC,
      options: {
        ...fileGrpcOption,
        url: `${host}:${port}`
      }
    }
  );
  await app.listen();
}
bootstrap();
