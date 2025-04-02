import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CART_REPOSITORY } from './di-token';
import { Cart } from './cart.interface';
import { IRepository } from '@app/shared';
import { AddToCartRequest } from '@app/shared/proto/cart';
import {
  ITEM_PACKAGE_NAME,
  ITEM_SERVICE_NAME,
  ItemServiceClient
} from '@app/shared/proto/item';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CartService implements OnModuleInit {
  private itemClientService: ItemServiceClient;

  constructor(
    @Inject(ITEM_PACKAGE_NAME) private readonly client: ClientGrpc,
    @Inject(CART_REPOSITORY) private readonly repository: IRepository<Cart>
  ) {}

  onModuleInit() {
    this.itemClientService =
      this.client.getService<ItemServiceClient>(ITEM_SERVICE_NAME);
  }

  async addToCart(payload: AddToCartRequest) {
    const { success } = await firstValueFrom(
      this.itemClientService.decreaseQuantity(payload)
    );
    const cart = await this.repository.create(payload);
    return { success: success && Boolean(cart) };
  }
}
