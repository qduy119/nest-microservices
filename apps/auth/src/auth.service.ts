import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { AppConfig } from './config';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyTokenRequest,
  VerifyTokenResponse
} from '@app/shared/proto/auth';
import {
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient
} from '@app/shared/proto/user';
import { firstValueFrom } from 'rxjs';
import { ROLE } from '@app/shared';
import { status } from '@grpc/grpc-js';

type JwtPayload = { id: string; roles: ROLE[] };

@Injectable()
export class AuthService implements OnModuleInit {
  private userClientService: UserServiceClient;

  constructor(
    @Inject(USER_PACKAGE_NAME) private readonly client: ClientGrpc,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  onModuleInit() {
    this.userClientService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    // Already handled user not found/user credentials are incorrect inside User Service
    try {
      const { user } = await firstValueFrom(
        this.userClientService.verifyUserCredentials(payload)
      );
      const [accessToken, refreshToken] = await Promise.all([
        this.generateToken({
          type: 'access_token',
          payload: { id: user.id, roles: user.roles }
        }),
        this.generateToken({
          type: 'refresh_token',
          payload: { id: user.id, roles: user.roles }
        })
      ]);
      return { accessToken, refreshToken };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const { user } = await firstValueFrom(
      this.userClientService.getUserByCredentials({ email: payload.email })
    );
    if (user) {
      throw new RpcException({
        status: status.ALREADY_EXISTS,
        message: 'User already exists'
      });
    }
    const { user: data } = await firstValueFrom(
      this.userClientService.createUser(payload)
    );
    return { isRegistered: Boolean(data) };
  }

  async refresh(payload: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const secret =
      this.configService.get<AppConfig['jwt']>('jwt').refresh_token.secret_key;
    try {
      const data: JwtPayload = await this.jwtService.verifyAsync(
        payload.refreshToken,
        {
          secret
        }
      );
      const accessToken = await this.generateToken({
        type: 'access_token',
        payload: data
      });
      const refreshToken = await this.generateToken({
        type: 'refresh_token',
        payload: data
      });
      return { accessToken, refreshToken };
    } catch {
      throw new RpcException({
        status: status.UNAUTHENTICATED,
        message: 'Unauthorized'
      });
    }
  }

  async verify(payload: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    const secret =
      this.configService.get<AppConfig['jwt']>('jwt').access_token.secret_key;
    try {
      const data: JwtPayload = await this.jwtService.verifyAsync(
        payload.accessToken,
        {
          secret
        }
      );
      const user = await firstValueFrom(
        this.userClientService.getUserById({ id: data.id })
      );
      return user;
    } catch {
      throw new RpcException({
        status: status.UNAUTHENTICATED,
        message: 'Unauthorized'
      });
    }
  }

  private async generateToken({
    type,
    payload
  }: {
    type: 'access_token' | 'refresh_token';
    payload: JwtPayload;
  }) {
    const { secret_key, expires_in } =
      this.configService.get<AppConfig['jwt']>('jwt')[type];
    const token = await this.jwtService.signAsync(payload, {
      secret: secret_key,
      expiresIn: expires_in
    });
    return token;
  }
}
