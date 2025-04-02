import { Controller, UseFilters } from '@nestjs/common';
import { CartService } from './cart.service';
import {
  AddToCartRequest,
  AddToCartResponse,
  CartServiceController,
  CartServiceControllerMethods
} from '@app/shared/proto/cart';
import { catchError, from, Observable, of } from 'rxjs';
import { CatchRpcExceptionFilter } from '@app/shared';

@UseFilters(CatchRpcExceptionFilter)
@CartServiceControllerMethods()
@Controller('cart')
export class CartController implements CartServiceController {
  constructor(private readonly cartService: CartService) {}

  addToCart(
    request: AddToCartRequest
  ):
    | Promise<AddToCartResponse>
    | Observable<AddToCartResponse>
    | AddToCartResponse {
    return from(this.cartService.addToCart(request)).pipe(
      catchError(() => {
        return of({ success: false });
      })
    );
  }
}
