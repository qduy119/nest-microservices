import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod()
  getById: string {
    return this.userService.getHello();
  }
}
