import { LoginReqDto, RefreshTokenDto, VerifyTokenDto } from '@app/shared/dto';

export interface IAuthService {
  login(request: LoginReqDto): Promise<{ accessToken: string }>;
  refreshToken(
    request: RefreshTokenDto
  ): Promise<{ accessToken: string; refreshToken: string }>;
  verifyToken(request: VerifyTokenDto): Promise<{ isVerified: boolean }>;
}
