import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginReqDto, RefreshTokenDto, VerifyTokenDto } from '@app/shared';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService')
  async login(data: LoginReqDto) {
    return await this.authService.login(data);
  }

  @GrpcMethod('AuthService')
  async refreshToken(data: RefreshTokenDto) {
    return await this.authService.refresh(data.refreshToken);
  }

  @GrpcMethod('AuthService')
  async verifyToken(data: VerifyTokenDto) {
    return await this.authService.verify(data.accessToken);
  }
}
