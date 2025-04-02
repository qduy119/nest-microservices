import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { orderGrpcOption, ShareConfig } from '@app/shared';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(OrderModule);
  const { host, port } = context
    .get(ConfigService)
    .get<ShareConfig['order_grpc']>('order_grpc');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderModule,
    {
      transport: Transport.GRPC,
      options: {
        ...orderGrpcOption,
        url: `${host}:${port}`
      }
    }
  );
  await app.listen();
}
bootstrap();
