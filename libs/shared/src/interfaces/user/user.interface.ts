import { GENDER, PROVIDER, ROLE } from '@app/shared/constants';

export interface IUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  gender: GENDER;
  provider: PROVIDER;
  avatar: string;
  roles: ROLE[];
}
