import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_PACKAGE, userProtoPath } from '@app/shared';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_PACKAGE,
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: userProtoPath
        }
      }
    ])
  ],
  controllers: [UserController]
})
export class UserModule {}
