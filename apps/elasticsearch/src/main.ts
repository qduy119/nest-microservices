import { NestFactory } from '@nestjs/core';
import { ElasticsearchModule } from './elasticsearch.module';
import { ConfigService } from '@nestjs/config';
import { elasticQueue, ShareConfig } from '@app/shared';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const context =
    await NestFactory.createApplicationContext(ElasticsearchModule);
  const { host, port, username, password } = context
    .get(ConfigService)
    .get<ShareConfig['elastic_rabbitmq']>('elastic_rabbitmq');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ElasticsearchModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${username}:${password}@${host}:${port}`],
        queue: elasticQueue,
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
