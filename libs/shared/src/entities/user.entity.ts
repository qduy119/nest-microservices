import { GENDER, PROVIDER, ROLE } from '@app/shared/constants';
import { ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'UserSchema' })
export class IUserEntity {
  id: string;
  email: string;
  password: string;
  fullName: string;
  gender: GENDER;
  provider: PROVIDER;
  avatar: string;
  roles: ROLE[];
}
