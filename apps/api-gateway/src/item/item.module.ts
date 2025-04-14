import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ITEM_PACKAGE_NAME } from '@app/shared/proto/item';
import { UPLOAD_PACKAGE_NAME } from '@app/shared/proto/upload';
import { ConfigService } from '@nestjs/config';
import {
  fileGrpcOption,
  itemGrpcOption,
  ShareConfig,
  ShareConfigModule
} from '@app/shared';
import { ItemService } from './item.service';

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
      },
      {
        name: UPLOAD_PACKAGE_NAME,
        inject: [ConfigService],
        imports: [ShareConfigModule],
        useFactory: (config: ConfigService) => {
          const { host, port } =
            config.get<ShareConfig['file_grpc']>('file_grpc');
          return {
            transport: Transport.GRPC,
            options: {
              ...fileGrpcOption,
              url: `${host}:${port}`
            }
          };
        }
      }
    ])
  ],
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule {}
