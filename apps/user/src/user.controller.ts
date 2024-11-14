import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { GetUserByIdDto } from '@app/shared';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @GrpcMethod('UserService')
  async getUserById(data: GetUserByIdDto) {
    const user = await this.userService.findById(data.id);
    return { user };
  }
}
