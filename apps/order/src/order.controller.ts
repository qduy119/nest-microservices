import { Controller, UseFilters } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CatchRpcExceptionFilter,
  CreateOrderEvent,
  ORDER_STATUS,
  PROCESS_ITEM_FAILED_EVENT
} from '@app/shared';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderServiceController,
  OrderServiceControllerMethods
} from '@app/shared/proto/order';
import { Observable } from 'rxjs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@UseFilters(CatchRpcExceptionFilter)
@OrderServiceControllerMethods()
@Controller('order')
export class OrderController implements OrderServiceController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern(PROCESS_ITEM_FAILED_EVENT)
  async handleItemFailed(
    @Payload() payload: CreateOrderEvent,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.orderService.updateOrder(payload.orderId, {
        status: ORDER_STATUS.ERROR
      });
      channel.ack(originalMsg);
    } catch (error) {
      console.log('Error payment: ', error);
      channel.nack(originalMsg, false, false);
    }
  }
  createOrder(
    request: CreateOrderRequest
  ):
    | Promise<CreateOrderResponse>
    | Observable<CreateOrderResponse>
    | CreateOrderResponse {
    return this.orderService.createOrder(request);
  }
}
