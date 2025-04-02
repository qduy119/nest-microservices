import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ShareConfig, ShareConfigModule, userGrpcOption } from '@app/shared';
import { AppConfigModule } from './config';
import { USER_PACKAGE_NAME } from '@app/shared/proto/user';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AppConfigModule,
    ShareConfigModule,
    ClientsModule.registerAsync([
      {
        name: USER_PACKAGE_NAME,
        inject: [ConfigService],
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
    ]),
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
