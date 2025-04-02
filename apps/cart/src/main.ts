import { NestFactory } from '@nestjs/core';
import { CartModule } from './cart.module';
import { ConfigService } from '@nestjs/config';
import { cartGrpcOption, ShareConfig } from '@app/shared';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(CartModule);
  const { host, port } = context
    .get(ConfigService)
    .get<ShareConfig['cart_grpc']>('cart_grpc');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CartModule,
    {
      transport: Transport.GRPC,
      options: {
        ...cartGrpcOption,
        url: `${host}:${port}`
      }
    }
  );

  await app.listen();
}
bootstrap();
