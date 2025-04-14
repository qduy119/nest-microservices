import { Controller, Inject, UseFilters } from '@nestjs/common';
import { ItemService } from './item.service';
import {
  CreateIndexRequest,
  CreateIndexResponse,
  CreateItemRequest,
  CreateItemResponse,
  GetAllItemsRequest,
  GetAllItemsResponse,
  ItemServiceController,
  ItemServiceControllerMethods,
  SearchItemRequest,
  SearchItemResponse
} from '@app/shared/proto/item';
import { from, map, Observable } from 'rxjs';
import {
  CatchRpcExceptionFilter,
  CREATE_ORDER_ITEM_EVENT,
  CREATE_ORDER_PAYMENT_EVENT,
  CreateOrderEvent,
  PROCESS_ITEM_FAILED_EVENT,
  PROCESS_PAYMENT_FAILED_EVENT
} from '@app/shared';
import {
  ClientRMQ,
  Ctx,
  EventPattern,
  Payload,
  RmqContext
} from '@nestjs/microservices';
import {
  ITEM_SERVICE_ORDER_RABBITMQ,
  ITEM_SERVICE_PAYMENT_RABBITMQ
} from './di-token';

@UseFilters(CatchRpcExceptionFilter)
@ItemServiceControllerMethods()
@Controller('item')
export class ItemController implements ItemServiceController {
  constructor(
    @Inject(ITEM_SERVICE_PAYMENT_RABBITMQ)
    private readonly clientPayment: ClientRMQ,
    @Inject(ITEM_SERVICE_ORDER_RABBITMQ)
    private readonly clientOrder: ClientRMQ,
    private readonly itemService: ItemService
  ) {}

  @EventPattern(CREATE_ORDER_ITEM_EVENT)
  async handleOrderCreate(
    @Payload() payload: CreateOrderEvent,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { orderItems } = payload;
      for (const orderItem of orderItems) {
        const { itemId, quantity } = orderItem;
        await this.itemService.decrease({ itemId, quantity });
      }
      this.clientPayment.emit(CREATE_ORDER_PAYMENT_EVENT, {
        ...payload
      });
      channel.ack(originalMsg);
    } catch (error) {
      console.log('Error payment: ', error);
      channel.nack(originalMsg, false, true);
    }
  }

  @EventPattern(PROCESS_PAYMENT_FAILED_EVENT)
  async handlePaymentFailed(
    @Payload() payload: CreateOrderEvent,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { orderItems } = payload;
      for (const orderItem of orderItems) {
        const { itemId, quantity } = orderItem;
        await this.itemService.increase({ itemId, quantity });
      }
      this.clientOrder.emit(PROCESS_ITEM_FAILED_EVENT, {
        ...payload
      });
      channel.ack(originalMsg);
    } catch (error) {
      console.log('Error payment: ', error);
      channel.nack(originalMsg, false, true);
    }
  }
  searchItem(
    request: SearchItemRequest
  ):
    | Promise<SearchItemResponse>
    | Observable<SearchItemResponse>
    | SearchItemResponse {
    return from(this.itemService.search(request));
  }
  createIndex(
    request: CreateIndexRequest
  ):
    | Promise<CreateIndexResponse>
    | Observable<CreateIndexResponse>
    | CreateIndexResponse {
    return from(this.itemService.createIndex(request));
  }
  getAll(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: GetAllItemsRequest
  ):
    | Promise<GetAllItemsResponse>
    | Observable<GetAllItemsResponse>
    | GetAllItemsResponse {
    return from(this.itemService.getAll());
  }
  createItem(
    request: CreateItemRequest
  ):
    | Promise<CreateItemResponse>
    | Observable<CreateItemResponse>
    | CreateItemResponse {
    return from(this.itemService.create(request)).pipe(
      map((item) => ({ item }))
    );
  }
}
