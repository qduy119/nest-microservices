import { Controller, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyTokenRequest,
  VerifyTokenResponse
} from '@app/shared/proto/auth';
import { Observable } from 'rxjs';
import { CatchRpcExceptionFilter } from '@app/shared';

@UseFilters(CatchRpcExceptionFilter)
@AuthServiceControllerMethods()
@Controller('auth')
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}
  login(
    request: LoginRequest
  ): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse {
    return this.authService.login(request);
  }
  register(
    request: RegisterRequest
  ):
    | Promise<RegisterResponse>
    | Observable<RegisterResponse>
    | RegisterResponse {
    return this.authService.register(request);
  }
  refreshToken(
    request: RefreshTokenRequest
  ):
    | Promise<RefreshTokenResponse>
    | Observable<RefreshTokenResponse>
    | RefreshTokenResponse {
    return this.authService.refresh(request);
  }
  verifyToken(
    request: VerifyTokenRequest
  ):
    | Promise<VerifyTokenResponse>
    | Observable<VerifyTokenResponse>
    | VerifyTokenResponse {
    return this.authService.verify(request);
  }
}
