import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from './databases/database.module';
import { userProviders } from './user.providers';
import { AppConfigModule } from './config';

@Module({
  imports: [AppConfigModule, DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders]
})
export class UserModule {}
