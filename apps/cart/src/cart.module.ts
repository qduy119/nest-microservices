import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { DatabaseModule } from './databases';
import { AppConfigModule } from './config';
import { cartProviders } from './cart.providers';
import { itemGrpcOption, ShareConfig, ShareConfigModule } from '@app/shared';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ITEM_PACKAGE_NAME } from '@app/shared/proto/item';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    AppConfigModule,
    ShareConfigModule,
    ClientsModule.registerAsync([
      {
        name: ITEM_PACKAGE_NAME,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const { host, port } =
            config.get<ShareConfig['item_grpc']>('item_grpc');
          return {
            transport: Transport.GRPC,
            options: {
              ...itemGrpcOption,
              url: `${host}:${port}`
            }
          };
        }
      }
    ])
  ],
  controllers: [CartController],
  providers: [CartService, ...cartProviders]
})
export class CartModule {}
