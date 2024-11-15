import { IUserService, LoginReqDto, USER_PACKAGE } from '@app/shared';
import {
  Inject,
  Injectable,
  OnModuleInit,
  ConflictException
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthService implements OnModuleInit {
  private userClientService: IUserService;

  constructor(@Inject(USER_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.userClientService =
      this.client.getService<IUserService>('UserService');
  }

  async login(payload: LoginReqDto) {
    const user = await this.userClientService.getUserByCredentials(payload);
    if (user) {
      return { accessToken: 'your_access_token' };
    }
    throw new ConflictException();
  }

  async refresh(refreshToken: string) {
    return { accessToken: 'your_access_token', refreshToken };
  }

  async verify(accessToken: string) {
    if (accessToken) {
      return { isVerified: true };
    }
    return { isVerified: false };
  }
}
