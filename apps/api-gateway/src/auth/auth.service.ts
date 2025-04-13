import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse
} from '@app/shared/proto/auth';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthServiceClient;

  constructor(@Inject(AUTH_PACKAGE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.authService.login(request);
  }
  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.authService.register(request);
  }
  refreshToken(request: RefreshTokenRequest): Observable<RefreshTokenResponse> {
    return this.authService.refreshToken(request);
  }
}
