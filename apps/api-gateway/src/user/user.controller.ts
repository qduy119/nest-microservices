import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req
} from '@nestjs/common';
import {
  CreateUserDto,
  IPaginatedParam,
  IUserEntity,
  ROLE,
  UpdateUserDto
} from '@app/shared';
import { USER_SERVICE_CLIENT } from './di-token';
import { UserServiceClient } from '@app/shared/proto/user';
import { Roles, User } from '../decorators';
import { firstValueFrom } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE_CLIENT)
    private readonly userServiceClient: UserServiceClient
  ) {}

  @Roles(ROLE.ADMIN)
  @Post()
  @HttpCode(200)
  create(@Body() createUserDto: CreateUserDto) {
    const data = this.userServiceClient.createUser(createUserDto);
    return firstValueFrom(data);
  }

  @Roles(ROLE.ADMIN)
  @Get()
  @HttpCode(200)
  findAll(@Req() req: Request) {
    const { page, limit } = req.query as IPaginatedParam;
    const data = this.userServiceClient.getAllUsers({
      params: { page, limit }
    });
    return firstValueFrom(data);
  }

  @Roles(ROLE.USER, ROLE.ADMIN)
  @Get('/me')
  @HttpCode(200)
  getMe(@User() user: IUserEntity) {
    const data = this.userServiceClient.getUserById({ id: user.id });
    return firstValueFrom(data);
  }

  @Roles(ROLE.ADMIN)
  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = this.userServiceClient.getUserById({ id });
    return firstValueFrom(data);
  }

  @Roles(ROLE.ADMIN)
  @Patch(':id')
  @HttpCode(200)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const payload = { id, ...updateUserDto };
    const data = this.userServiceClient.updateUser(payload);
    return firstValueFrom(data);
  }

  @Roles(ROLE.ADMIN)
  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    const data = this.userServiceClient.deleteUser({ id });
    return firstValueFrom(data);
  }
}
