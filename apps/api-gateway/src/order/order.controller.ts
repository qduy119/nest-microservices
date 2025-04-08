import { Controller, Post, Body, Inject, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  CreateOrderDto,
  IOrderEntity,
  IOrderItemEntity,
  IUserEntity,
  ROLE
} from '@app/shared';
import { Roles, User } from '../decorators';
import { ORDER_SERVICE_CLIENT } from './di-token';
import { OrderServiceClient } from '@app/shared/proto/order';
import { lastValueFrom } from 'rxjs';

@ApiExtraModels(IOrderEntity)
@ApiExtraModels(IOrderItemEntity)
@ApiTags('Order')
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(
    @Inject(ORDER_SERVICE_CLIENT)
    private readonly orderServiceClient: OrderServiceClient
  ) {}

  @Roles(ROLE.USER)
  @Post()
  @HttpCode(200)
  create(@User() user: IUserEntity, @Body() createOrderDto: CreateOrderDto) {
    const data = this.orderServiceClient.createOrder({
      userId: user.id,
      ...createOrderDto
    });
    return lastValueFrom(data);
  }
}
