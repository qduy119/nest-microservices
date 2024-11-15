import { AUTH_PACKAGE, IAuthService, LoginReqDto } from '@app/shared';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: IAuthService;

  constructor(@Inject(AUTH_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<IAuthService>('AuthService');
  }

  async login(loginReqDto: LoginReqDto) {
    return await this.authService.login(loginReqDto);
  }
  async refreshToken(refreshToken: string) {
    return await this.authService.refreshToken({ refreshToken });
  }
}
