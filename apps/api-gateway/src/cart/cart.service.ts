import {
  AddToCartRequest,
  AddToCartResponse,
  CART_PACKAGE_NAME,
  CART_SERVICE_NAME,
  CartServiceClient
} from '@app/shared/proto/cart';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class CartService implements OnModuleInit, CartServiceClient {
  private cartService: CartServiceClient;

  constructor(@Inject(CART_PACKAGE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.cartService =
      this.client.getService<CartServiceClient>(CART_SERVICE_NAME);
  }

  addToCart(request: AddToCartRequest): Observable<AddToCartResponse> {
    return this.cartService.addToCart(request);
  }
}
