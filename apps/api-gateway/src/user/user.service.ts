import {
  CreateUserDto,
  UpdateUserDto,
  USER_PACKAGE,
  IUserService,
  GetUserByIdDto,
  DeleteUserDto
} from '@app/shared';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UserClientService implements OnModuleInit {
  private userService: IUserService;

  constructor(@Inject(USER_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<IUserService>('UserService');
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  async findAll() {
    return await this.userService.getAllUsers();
  }

  async findOne(getUserByIdDto: GetUserByIdDto) {
    return await this.userService.getUserById(getUserByIdDto);
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(updateUserDto);
  }

  async remove(deleteUserDto: DeleteUserDto) {
    return await this.userService.deleteUser(deleteUserDto);
  }
}
