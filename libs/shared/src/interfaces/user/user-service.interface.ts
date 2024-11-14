import {
  CreateUserDto,
  DeleteUserDto,
  GetUserByIdDto,
  UpdateUserDto
} from '@app/shared/dto';
import { IUser } from './user.interface';

export interface IUserService {
  updateUser(request: UpdateUserDto): Promise<{ status: boolean }>;
  createUser(request: CreateUserDto): Promise<{ status: boolean }>;
  deleteUser(request: DeleteUserDto): Promise<{ status: boolean }>;
  getUserById(request: GetUserByIdDto): Promise<{ user: IUser }>;
  getAllUsers(): Promise<{ users: IUser[] }>;
}
