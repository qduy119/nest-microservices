import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { paymentProviders } from './payment.providers';
import { AppConfigModule } from './config';
import {
  itemQueue,
  ShareConfig,
  ShareConfigModule,
  userGrpcOption
} from '@app/shared';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  PAYMENT_SERVICE_ITEM_RABBITMQ,
  PAYMENT_SERVICE_KAFKA
} from './di-token';
import { ConfigService } from '@nestjs/config';
import { USER_PACKAGE_NAME } from '@app/shared/proto/user';
import { DatabaseModule } from './databases';

@Module({
  imports: [
    AppConfigModule,
    ShareConfigModule,
    DatabaseModule,
    ClientsModule.registerAsync([
      {
        name: PAYMENT_SERVICE_KAFKA,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const { host, port } =
            configService.get<ShareConfig['notification_kafka']>(
              'notification_kafka'
            );
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: [`${host}:${port}`]
              }
            }
          };
        }
      },
      {
        name: PAYMENT_SERVICE_ITEM_RABBITMQ,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const { host, port, username, password } =
            configService.get<ShareConfig['item_rabbitmq']>('item_rabbitmq');
          return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${username}:${password}@${host}:${port}`],
              queue: itemQueue,
              noAck: true,
              queueOptions: {
                durable: false
              }
            }
          };
        }
      },
      {
        name: USER_PACKAGE_NAME,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const { host, port } =
            config.get<ShareConfig['user_grpc']>('user_grpc');
          return {
            transport: Transport.GRPC,
            options: {
              ...userGrpcOption,
              url: `${host}:${port}`
            }
          };
        }
      }
    ])
  ],
  controllers: [PaymentController],
  providers: [PaymentService, ...paymentProviders]
})
export class PaymentModule {}
