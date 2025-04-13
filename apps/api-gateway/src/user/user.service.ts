import {
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  GetAllUsersRequest,
  GetAllUsersResponse,
  GetUserByCredentialsRequest,
  GetUserByCredentialsResponse,
  GetUserByIdRequest,
  GetUserByIdResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient
} from '@app/shared/proto/user';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject(USER_PACKAGE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  updateUser(request: UpdateUserRequest): Observable<UpdateUserResponse> {
    return this.userService.updateUser(request);
  }
  createUser(request: CreateUserRequest): Observable<CreateUserResponse> {
    return this.userService.createUser(request);
  }
  deleteUser(request: DeleteUserRequest): Observable<DeleteUserResponse> {
    return this.userService.deleteUser(request);
  }
  getUserById(request: GetUserByIdRequest): Observable<GetUserByIdResponse> {
    return this.userService.getUserById(request);
  }
  getUserByCredentials(
    request: GetUserByCredentialsRequest
  ): Observable<GetUserByCredentialsResponse> {
    return this.userService.getUserByCredentials(request);
  }
  getAllUsers(request: GetAllUsersRequest): Observable<GetAllUsersResponse> {
    return this.userService.getAllUsers(request);
  }
}
