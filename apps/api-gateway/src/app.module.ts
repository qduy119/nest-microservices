import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';
import { AuthGuard, RolesGuard } from './guards';
import { AppConfigModule } from './config';
import { authGrpcOption, ShareConfig, ShareConfigModule } from '@app/shared';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from '@app/shared/proto/auth';
import { ConfigService } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    AppConfigModule,
    ShareConfigModule,
    UserModule,
    AuthModule,
    CartModule,
    ItemModule,
    OrderModule,
    PaymentModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_PACKAGE_NAME,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const { host, port } =
            config.get<ShareConfig['auth_grpc']>('auth_grpc'); // Use in auth guard
          return {
            transport: Transport.GRPC,
            options: {
              ...authGrpcOption,
              url: `${host}:${port}`
            }
          };
        }
      }
    ])
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
