import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppConfigModule } from './config';

@Module({
  imports: [AppConfigModule, UserModule]
})
export class AppModule {}
