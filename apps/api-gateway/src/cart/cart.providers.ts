import { Provider } from '@nestjs/common';
import { CART_SERVICE_CLIENT } from './di-token';
import { CartService } from './cart.service';

export const cartProviders: Provider[] = [
  {
    provide: CART_SERVICE_CLIENT,
    useClass: CartService
  }
];
