import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AddToCartDto, ICartEntity, IUserEntity, ROLE } from '@app/shared';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Roles, User } from '../decorators';
import { firstValueFrom } from 'rxjs';
import { CartService } from './cart.service';

@ApiExtraModels(ICartEntity)
@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartServiceClient: CartService) {}

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
