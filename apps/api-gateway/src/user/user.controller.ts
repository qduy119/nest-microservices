import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from '@app/shared';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Payload() createUserDto: CreateUserDto) {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {}

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Payload() updateUserDto: UpdateUserDto
  ) {}

  remove(@Param('id', ParseUUIDPipe) id: string) {}
}
