import { LoginReqDto, RegisterReqDto } from '@app/shared/dto';

export interface IAuthService {
  login(request: LoginReqDto): Promise<{ accessToken: string }>;
  refreshToken(): Promise<{ accessToken: string }>;
  register(request: RegisterReqDto): Promise<{ status: boolean }>;
}
