import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { AppConfigModule } from './config';
import { DatabaseModule } from './databases';
import { itemProviders } from './item.providers';
import { elasticQueue, ShareConfig, ShareConfigModule } from '@app/shared';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ELASTIC_SERVICE_RABBITMQ } from './di-token';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AppConfigModule,
    ShareConfigModule,
    DatabaseModule,
    ClientsModule.registerAsync([
      {
        name: ELASTIC_SERVICE_RABBITMQ,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const { host, port, username, password } =
            configService.get<ShareConfig['elastic_rabbitmq']>(
              'elastic_rabbitmq'
            );
          return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${username}:${password}@${host}:${port}`],
              queue: elasticQueue,
              noAck: true,
              queueOptions: {
                durable: false
              }
            }
          };
        }
      }
    ])
  ],
  controllers: [ItemController],
  providers: [ItemService, ...itemProviders]
})
export class ItemModule {}
