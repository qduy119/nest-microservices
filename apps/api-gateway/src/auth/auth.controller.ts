import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginReqDto } from '@app/shared';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authClientService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginReqDto: LoginReqDto) {
    return await this.authClientService.login(loginReqDto);
  }

  @Get('refresh-token')
  @HttpCode(200)
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies['refresh-token'];
    return await this.authClientService.refreshToken(refreshToken);
  }
}
