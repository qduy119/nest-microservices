import {
  CreateOrderRequest,
  CreateOrderResponse,
  ORDER_PACKAGE_NAME,
  ORDER_SERVICE_NAME,
  OrderServiceClient
} from '@app/shared/proto/order';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class OrderService implements OnModuleInit, OrderServiceClient {
  private orderService: OrderServiceClient;

  constructor(
    @Inject(ORDER_PACKAGE_NAME) private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.orderService =
      this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  createOrder(request: CreateOrderRequest): Observable<CreateOrderResponse> {
    return this.orderService.createOrder(request);
  }
}
