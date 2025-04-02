import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';
import { LoginReqDto, RegisterReqDto, ROLE } from '@app/shared';
import { Cookies, Public, Roles } from '../decorators';
import { AUTH_SERVICE_CLIENT } from './di-token';
import { AuthServiceClient } from '@app/shared/proto/auth';
import { firstValueFrom } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_CLIENT)
    private readonly authClientService: AuthServiceClient
  ) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() loginReqDto: LoginReqDto) {
    const data = this.authClientService.login(loginReqDto);
    return firstValueFrom(data);
  }

  @Public()
  @Post('register')
  @HttpCode(200)
  register(@Body() registeReqDto: RegisterReqDto) {
    const data = this.authClientService.register(registeReqDto);
    return firstValueFrom(data);
  }

  @Roles(ROLE.USER, ROLE.ADMIN)
  @Get('refresh-token')
  @HttpCode(200)
  refresh(@Cookies('refresh-token') refreshToken: string) {
    const data = this.authClientService.refreshToken({ refreshToken });
    return firstValueFrom(data);
  }
}
