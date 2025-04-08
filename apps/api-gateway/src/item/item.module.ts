import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ITEM_PACKAGE_NAME } from '@app/shared/proto/item';
import { ConfigService } from '@nestjs/config';
import { itemGrpcOption, ShareConfig, ShareConfigModule } from '@app/shared';
import { itemProviders } from './item.providers';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ITEM_PACKAGE_NAME,
        inject: [ConfigService],
        imports: [ShareConfigModule],
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
  controllers: [ItemController],
  providers: [...itemProviders]
})
export class ItemModule {}
