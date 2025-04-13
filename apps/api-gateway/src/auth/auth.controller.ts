import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { LoginReqDto, RegisterReqDto, ROLE } from '@app/shared';
import { Cookies, Public, Roles } from '../decorators';
import { firstValueFrom } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authClientService: AuthService) {}

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
