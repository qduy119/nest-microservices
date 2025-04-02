import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { itemGrpcOption, ShareConfig } from '@app/shared';
import { ItemModule } from './item.module';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(ItemModule);
  const { host, port } = context
    .get(ConfigService)
    .get<ShareConfig['item_grpc']>('item_grpc');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ItemModule,
    {
      transport: Transport.GRPC,
      options: {
        ...itemGrpcOption,
        url: `${host}:${port}`
      }
    }
  );

  await app.listen();
}
bootstrap();
