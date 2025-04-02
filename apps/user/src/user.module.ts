import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from './databases';
import { userProviders } from './user.providers';
import { AppConfigModule } from './config';
import { ShareConfigModule } from '@app/shared';

@Module({
  imports: [AppConfigModule, ShareConfigModule, DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders]
})
export class UserModule {}
