import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  CreateOrderDto,
  IOrderEntity,
  IOrderItemEntity,
  IUserEntity,
  ROLE
} from '@app/shared';
import { Roles, User } from '../decorators';
import { lastValueFrom } from 'rxjs';
import { OrderService } from './order.service';

@ApiExtraModels(IOrderEntity)
@ApiExtraModels(IOrderItemEntity)
@ApiTags('Order')
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderServiceClient: OrderService) {}

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
