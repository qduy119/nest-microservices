import { NestFactory } from '@nestjs/core';
import { ElasticsearchModule } from './elasticsearch.module';
import { ConfigService } from '@nestjs/config';
import { ShareConfig } from '@app/shared';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const context =
    await NestFactory.createApplicationContext(ElasticsearchModule);
  const { host, port } = context
    .get(ConfigService)
    .get<ShareConfig['elasticsearch_kafka']>('elasticsearch_kafka');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ElasticsearchModule,
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
