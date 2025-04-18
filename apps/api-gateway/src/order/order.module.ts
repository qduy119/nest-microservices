import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_PACKAGE_NAME } from '@app/shared/proto/order';
import { ConfigService } from '@nestjs/config';
import { orderGrpcOption, ShareConfig, ShareConfigModule } from '@app/shared';
import { OrderService } from './order.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ORDER_PACKAGE_NAME,
        inject: [ConfigService],
        imports: [ShareConfigModule],
        useFactory: (config: ConfigService) => {
          const { host, port } =
            config.get<ShareConfig['order_grpc']>('order_grpc');
          return {
            transport: Transport.GRPC,
            options: {
              ...orderGrpcOption,
              url: `${host}:${port}`
            }
          };
        }
      }
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
