import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ShareConfig, ShareConfigModule, userGrpcOption } from '@app/shared';
import { UserController } from './user.controller';
import { USER_PACKAGE_NAME } from '@app/shared/proto/user';
import { ConfigService } from '@nestjs/config';
import { userServiceProviders } from './user.providers';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USER_PACKAGE_NAME,
        inject: [ConfigService],
        imports: [ShareConfigModule],
        useFactory: (config: ConfigService) => {
          const { host, port } =
            config.get<ShareConfig['user_grpc']>('user_grpc');
          return {
            transport: Transport.GRPC,
            options: {
              ...userGrpcOption,
              url: `${host}:${port}`
            }
          };
        }
      }
    ])
  ],
  controllers: [UserController],
  providers: [...userServiceProviders]
})
export class UserModule {}
