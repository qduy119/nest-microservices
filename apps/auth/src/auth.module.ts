import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule } from '@nestjs/microservices';
import { AUTH_PACKAGE, authGrpcClientOption } from '@app/shared';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_PACKAGE,
        options: authGrpcClientOption
      }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
