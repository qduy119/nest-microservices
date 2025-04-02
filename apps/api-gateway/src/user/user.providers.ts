import { Provider } from '@nestjs/common';
import { USER_SERVICE_CLIENT } from './di-token';
import { UserService } from './user.service';

export const userServiceProviders: Provider[] = [
  {
    provide: USER_SERVICE_CLIENT,
    useClass: UserService
  }
];
