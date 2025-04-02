import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_ITEM_REPOSITORY,
  ORDER_REPOSITORY,
  ORDER_SERVICE_RABBITMQ
} from './di-token';
import { ClientRMQ } from '@nestjs/microservices';
import { CREATE_ORDER_EVENT, IRepository } from '@app/shared';
import { Order } from './order.interface';
import { OrderItem } from './order-item.interface';
import { OrderItem as OrderItemProto } from '@app/shared/proto/order';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_SERVICE_RABBITMQ) private readonly client: ClientRMQ,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IRepository<Order>,
    @Inject(ORDER_ITEM_REPOSITORY)
    private readonly orderItemRepository: IRepository<OrderItem>
  ) {}

  async createOrder(payload: { userId: string; orderItems: OrderItemProto[] }) {
    const { userId, orderItems } = payload;
    const total = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const order = await this.orderRepository.create({ total, userId });
    orderItems.forEach(async (orderItem) => {
      await this.orderItemRepository.create({
        ...orderItem,
        orderId: order._id
      });
    });
    this.client.emit(CREATE_ORDER_EVENT, {
      userId,
      orderId: order._id,
      total
    });
    return { success: Boolean(order) };
  }
}
