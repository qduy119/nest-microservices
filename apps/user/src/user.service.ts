import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserModel } from './user.model';
import { USER_REPOSITORY } from './di-token';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { IPaginatedParam, IRepository } from '@app/shared';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IRepository<UserModel>
  ) {}

  async findById(id: string) {
    this.logger.debug('[USER_SERVICE] findById: ' + id);
    return this.userRepository.findOne({ id });
  }

  findByCredentials({
    email,
    password
  }: {
    email?: string;
    password?: string;
  }) {
    const filter = {} as any;
    if (email) filter.email = email;
    if (password) filter.password = password;
    this.logger.debug('[USER_SERVICE] findByCredentials: ', email, password);
    return this.userRepository.findOne(filter);
  }

  findAll({
    filter,
    params
  }: {
    filter?: Partial<UserModel>;
    params?: IPaginatedParam;
  }) {
    this.logger.debug('[USER_SERVICE] findAll');
    return this.userRepository.findAll(filter, params);
  }

  async verifyUserCredentials({
    email,
    password
  }: {
    email?: string;
    password?: string;
  }) {
    const user = await this.findByCredentials({ email });
    if (!user) {
      throw new RpcException({
        status: status.NOT_FOUND,
        message: 'User not found'
      });
    }
    const isCorrectedPassword = await user.isCorrectedPassword(password);
    if (!isCorrectedPassword) {
      throw new RpcException({
        status: status.UNKNOWN,
        message: 'Email or password is incorrect'
      });
    }
    return user;
  }

  async create(payload: Partial<UserModel>) {
    this.logger.debug('[USER_SERVICE] create: ', payload);
    const data = await this.userRepository.create(payload);
    return data;
  }

  async update(payload: Partial<UserModel>) {
    this.logger.debug('[USER_SERVICE] update: ', payload);
    const { id, ...rest } = payload;
    const { success } = await this.userRepository.update(id, rest);
    return { success };
  }

  async delete(payload: { id: string }) {
    const { id } = payload;
    this.logger.debug('[USER_SERVICE] delete: ', id);
    const { success } = await this.userRepository.remove(id);
    return { success };
  }
}
