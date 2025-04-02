import { Provider } from '@nestjs/common';
import { USER_MODEL, USER_REPOSITORY } from './di-token';
import { UserModel } from './user.model';
import { UserRepository } from './user.repository';

export const userProviders: Provider[] = [
  {
    provide: USER_MODEL,
    useValue: UserModel
  },
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository
  }
];
