import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { orderProviders } from './order.providers';
import { AppConfigModule } from './config';
import { orderQueue, ShareConfig, ShareConfigModule } from '@app/shared';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_SERVICE_RABBITMQ } from './di-token';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from './databases';

@Module({
  imports: [
    AppConfigModule,
    ShareConfigModule,
    DatabaseModule,
    ClientsModule.registerAsync([
      {
        name: ORDER_SERVICE_RABBITMQ,
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
  controllers: [OrderController],
  providers: [OrderService, ...orderProviders]
})
export class OrderModule {}
