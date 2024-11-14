import { Inject, Injectable, Logger } from '@nestjs/common';
import { USER_REPOSITORY } from './constant';
import { User } from './user.entity';
import { IUser } from '@app/shared';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@Inject(USER_REPOSITORY) private userRepository: typeof User) {}

  async findById(id: string): Promise<IUser> {
    this.logger.debug('[USER_SERVICE] findById: ' + id);
    return await this.userRepository.findByPk(id);
  }
}
