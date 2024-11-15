import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE, authGrpcClientOption } from '@app/shared';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_PACKAGE,
        transport: Transport.GRPC,
        options: authGrpcClientOption
      }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
