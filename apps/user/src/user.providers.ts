import { User } from './user.entity';
import { USER_REPOSITORY } from './user.repository';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User
  }
];
