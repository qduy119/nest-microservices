import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { DatabaseModule } from './databases';
import { AppConfigModule } from './config';
import { cartProviders } from './cart.providers';
import { ShareConfigModule } from '@app/shared';

@Module({
  imports: [DatabaseModule, AppConfigModule, ShareConfigModule],
  controllers: [CartController],
  providers: [CartService, ...cartProviders]
})
export class CartModule {}
