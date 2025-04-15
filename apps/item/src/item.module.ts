import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { AppConfigModule } from './config';
import { DatabaseModule } from './databases';
import { itemProviders } from './item.providers';
import {
  orderQueue,
  paymentQueue,
  ShareConfig,
  ShareConfigModule
} from '@app/shared';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ELASTIC_SERVICE_KAFKA,
  ITEM_SERVICE_ORDER_RABBITMQ,
  ITEM_SERVICE_PAYMENT_RABBITMQ
} from './di-token';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AppConfigModule,
    ShareConfigModule,
    DatabaseModule,
    ClientsModule.registerAsync([
      {
        name: ELASTIC_SERVICE_KAFKA,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const { host, port } = configService.get<
            ShareConfig['elasticsearch_kafka']
          >('elasticsearch_kafka');
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'item',
                brokers: [`${host}:${port}`]
              },
              consumer: {
                groupId: 'item-consumer-elasticsearch',
                allowAutoTopicCreation: true
              },
              subscribe: {
                fromBeginning: true
              }
            }
          };
        }
      },
      {
        name: ITEM_SERVICE_PAYMENT_RABBITMQ,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const { host, port, username, password } =
            configService.get<ShareConfig['payment_rabbitmq']>(
              'payment_rabbitmq'
            );
          return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${username}:${password}@${host}:${port}`],
              queue: paymentQueue,
              noAck: true,
              queueOptions: {
                durable: false
              }
            }
          };
        }
      },
      {
        name: ITEM_SERVICE_ORDER_RABBITMQ,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const { host, port, username, password } =
            configService.get<ShareConfig['order_rabbitmq']>('order_rabbitmq');
          return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${username}:${password}@${host}:${port}`],
              queue: orderQueue,
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
