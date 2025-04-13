import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { itemGrpcOption, itemQueue, ShareConfig } from '@app/shared';
import { ItemModule } from './item.module';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(ItemModule);
  const { host, port } = context
    .get(ConfigService)
    .get<ShareConfig['item_grpc']>('item_grpc');
  const {
    host: itemHost,
    port: itemPort,
    username,
    password
  } = context
    .get(ConfigService)
    .get<ShareConfig['item_rabbitmq']>('item_rabbitmq');

  const appGrpc = await NestFactory.createMicroservice<MicroserviceOptions>(
    ItemModule,
    {
      transport: Transport.GRPC,
      options: {
        ...itemGrpcOption,
        url: `${host}:${port}`
      }
    }
  );
  const appRabbitmq = await NestFactory.createMicroservice<MicroserviceOptions>(
    ItemModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${username}:${password}@${itemHost}:${itemPort}`],
        queue: itemQueue,
        noAck: false,
        queueOptions: {
          durable: false
        }
      }
    }
  );

  await appGrpc.listen();
  await appRabbitmq.listen();
}
bootstrap();
