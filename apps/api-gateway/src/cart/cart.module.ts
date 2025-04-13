import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CART_PACKAGE_NAME } from '@app/shared/proto/cart';
import { ConfigService } from '@nestjs/config';
import { cartGrpcOption, ShareConfig, ShareConfigModule } from '@app/shared';
import { CartService } from './cart.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CART_PACKAGE_NAME,
        inject: [ConfigService],
        imports: [ShareConfigModule],
        useFactory: (config: ConfigService) => {
          const { host, port } =
            config.get<ShareConfig['cart_grpc']>('cart_grpc');
          return {
            transport: Transport.GRPC,
            options: {
              ...cartGrpcOption,
              url: `${host}:${port}`
            }
          };
        }
      }
    ])
  ],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
