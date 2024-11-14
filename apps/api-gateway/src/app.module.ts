import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppConfigModule } from './config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AppConfigModule, UserModule, AuthModule]
})
export class AppModule {}
