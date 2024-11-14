import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { CreateUserDto, UpdateUserDto } from '@app/shared';
import { UserClientService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userClientService: UserClientService) {}

  @Post()
  @HttpCode(200)
  async create(@Payload() createUserDto: CreateUserDto) {
    return await this.userClientService.create(createUserDto);
  }

  @Get()
  @HttpCode(200)
  async findAll() {
    return await this.userClientService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userClientService.findOne({ id });
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Payload() updateUserDto: UpdateUserDto
  ) {
    return await this.userClientService.update({ id, ...updateUserDto });
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userClientService.remove({ id });
  }
}
