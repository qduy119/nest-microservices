import { Inject, Injectable } from '@nestjs/common';
import { CART_REPOSITORY } from './di-token';
import { Cart } from './cart.interface';
import { IRepository } from '@app/shared';
import { AddToCartRequest } from '@app/shared/proto/cart';

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_REPOSITORY) private readonly repository: IRepository<Cart>
  ) {}

  async addToCart(payload: AddToCartRequest) {
    const cart = await this.repository.create(payload);
    return { success: Boolean(cart) };
  }
}
