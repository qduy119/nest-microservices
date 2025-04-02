import { Provider } from '@nestjs/common';
import { AUTH_SERVICE_CLIENT } from './di-token';
import { AuthService } from './auth.service';

export const authServiceProviders: Provider[] = [
  {
    provide: AUTH_SERVICE_CLIENT,
    useClass: AuthService
  }
];
