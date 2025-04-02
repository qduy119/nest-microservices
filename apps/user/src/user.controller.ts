import { Controller, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
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
  UserServiceController,
  UserServiceControllerMethods,
  VerifyUserCredentialsRequest,
  VerifyUserCredentialsResponse
} from '@app/shared/proto/user';
import { from, map, Observable } from 'rxjs';
import { CatchRpcExceptionFilter } from '@app/shared';

@UseFilters(CatchRpcExceptionFilter)
@UserServiceControllerMethods()
@Controller('user')
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}
  getAllUsers(
    request: GetAllUsersRequest
  ):
    | Promise<GetAllUsersResponse>
    | Observable<GetAllUsersResponse>
    | GetAllUsersResponse {
    return from(this.userService.findAll(request));
  }
  updateUser(
    request: UpdateUserRequest
  ):
    | Promise<UpdateUserResponse>
    | Observable<UpdateUserResponse>
    | UpdateUserResponse {
    return from(this.userService.update(request));
  }
  createUser(
    request: CreateUserRequest
  ):
    | Promise<CreateUserResponse>
    | Observable<CreateUserResponse>
    | CreateUserResponse {
    return from(this.userService.create(request)).pipe(
      map((user) => ({ user }))
    );
  }
  deleteUser(
    request: DeleteUserRequest
  ):
    | Promise<DeleteUserResponse>
    | Observable<DeleteUserResponse>
    | DeleteUserResponse {
    return from(this.userService.delete(request));
  }
  getUserById(
    request: GetUserByIdRequest
  ):
    | Promise<GetUserByIdResponse>
    | Observable<GetUserByIdResponse>
    | GetUserByIdResponse {
    return from(this.userService.findById(request.id)).pipe(
      map((user) => ({ user }))
    );
  }
  getUserByCredentials(
    request: GetUserByCredentialsRequest
  ):
    | Promise<GetUserByCredentialsResponse>
    | Observable<GetUserByCredentialsResponse>
    | GetUserByCredentialsResponse {
    return from(this.userService.findByCredentials(request)).pipe(
      map((user) => ({ user }))
    );
  }
  verifyUserCredentials(
    request: VerifyUserCredentialsRequest
  ):
    | Promise<VerifyUserCredentialsResponse>
    | Observable<VerifyUserCredentialsResponse>
    | VerifyUserCredentialsResponse {
    return from(this.userService.verifyUserCredentials(request)).pipe(
      map((user) => ({ user }))
    );
  }
}
