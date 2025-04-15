import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { notificationQueue, ShareConfig } from '@app/shared';

async function bootstrap() {
  const context =
    await NestFactory.createApplicationContext(NotificationModule);
  const { host, port, username, password } = context
    .get(ConfigService)
    .get<ShareConfig['notification_rabbitmq']>('notification_rabbitmq');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${username}:${password}@${host}:${port}`],
        queue: notificationQueue,
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
