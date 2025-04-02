import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ShareConfig } from '@app/shared';

async function bootstrap() {
  const context =
    await NestFactory.createApplicationContext(NotificationModule);
  const { host, port } = context
    .get(ConfigService)
    .get<ShareConfig['notification_kafka']>('notification_kafka');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [`${host}:${port}`]
        }
      }
    }
  );
  await app.listen();
}
bootstrap();
