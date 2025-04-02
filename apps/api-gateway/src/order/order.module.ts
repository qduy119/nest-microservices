import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { cartProviders } from './order.providers';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_PACKAGE_NAME } from '@app/shared/proto/order';
import { ConfigService } from '@nestjs/config';
import { orderGrpcOption, ShareConfig, ShareConfigModule } from '@app/shared';

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
  providers: [OrderService, ...cartProviders]
})
export class OrderModule {}
