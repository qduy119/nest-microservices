import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { orderGrpcOption, orderQueue, ShareConfig } from '@app/shared';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(OrderModule);
  const { host, port } = context
    .get(ConfigService)
    .get<ShareConfig['order_grpc']>('order_grpc');
  const {
    host: orderHost,
    port: orderPort,
    username,
    password
  } = context
    .get(ConfigService)
    .get<ShareConfig['order_rabbitmq']>('order_rabbitmq');
  const appGrpc = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderModule,
    {
      transport: Transport.GRPC,
      options: {
        ...orderGrpcOption,
        url: `${host}:${port}`
      }
    }
  );
  const appRabbitmq = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${username}:${password}@${orderHost}:${orderPort}`],
        queue: orderQueue,
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
