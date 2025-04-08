import { Controller, Post, Body, Inject, HttpCode } from '@nestjs/common';
import { AddToCartDto, ICartEntity, IUserEntity, ROLE } from '@app/shared';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CartServiceClient } from '@app/shared/proto/cart';
import { CART_SERVICE_CLIENT } from './di-token';
import { Roles, User } from '../decorators';
import { firstValueFrom } from 'rxjs';

@ApiExtraModels(ICartEntity)
@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(
    @Inject(CART_SERVICE_CLIENT)
    private readonly cartServiceClient: CartServiceClient
  ) {}

  @Roles(ROLE.USER)
  @Post()
  @HttpCode(200)
  create(@User() user: IUserEntity, @Body() createCartDto: AddToCartDto) {
    const data = this.cartServiceClient.addToCart({
      userId: user.id,
      ...createCartDto
    });
    return firstValueFrom(data);
  }
}
