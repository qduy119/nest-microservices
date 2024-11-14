import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_PACKAGE, userGrpcClientOption } from '@app/shared';
import { UserController } from './user.controller';
import { UserClientService } from './user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_PACKAGE,
        transport: Transport.GRPC,
        options: userGrpcClientOption
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserClientService]
})
export class UserModule {}
