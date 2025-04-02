import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { orderQueue, ShareConfig } from '@app/shared';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(PaymentModule);
  const { host, port, username, password } = context
    .get(ConfigService)
    .get<ShareConfig['payment_rabbitmq']>('payment_rabbitmq');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PaymentModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${username}:${password}@${host}:${port}`],
        queue: orderQueue,
        noAck: false,
        queueOptions: {
          durable: false
        }
      }
    }
  );

  await app.listen();
}
bootstrap();
