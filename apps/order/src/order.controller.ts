import { Controller, UseFilters } from '@nestjs/common';
import { OrderService } from './order.service';
import { CatchRpcExceptionFilter } from '@app/shared';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderServiceController,
  OrderServiceControllerMethods
} from '@app/shared/proto/order';
import { Observable } from 'rxjs';

@UseFilters(CatchRpcExceptionFilter)
@OrderServiceControllerMethods()
@Controller('order')
export class OrderController implements OrderServiceController {
  constructor(private readonly orderService: OrderService) {}

  createOrder(
    request: CreateOrderRequest
  ):
    | Promise<CreateOrderResponse>
    | Observable<CreateOrderResponse>
    | CreateOrderResponse {
    return this.orderService.createOrder(request);
  }
}
