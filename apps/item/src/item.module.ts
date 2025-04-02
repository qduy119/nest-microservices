import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { AppConfigModule } from './config';
import { DatabaseModule } from './databases';
import { itemProviders } from './item.providers';
import { ShareConfigModule } from '@app/shared';

@Module({
  imports: [AppConfigModule, ShareConfigModule, DatabaseModule],
  controllers: [ItemController],
  providers: [ItemService, ...itemProviders]
})
export class ItemModule {}
