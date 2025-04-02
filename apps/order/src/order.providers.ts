import { Provider } from '@nestjs/common';
import {
  DATABASE_CONNECTION,
  ORDER_ITEM_MODEL,
  ORDER_ITEM_REPOSITORY,
  ORDER_MODEL,
  ORDER_REPOSITORY
} from './di-token';
import { Connection } from 'mongoose';
import { OrderSchema } from './order.schema';
import { OrderRepository } from './order.repository';
import { OrderItemSchema } from './order-item.schema';
import { OrderItemRepository } from './order-item.repository';

export const orderProviders: Provider[] = [
  {
    provide: ORDER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Order', OrderSchema),
    inject: [DATABASE_CONNECTION]
  },
  {
    provide: ORDER_ITEM_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('OrderItem', OrderItemSchema),
    inject: [DATABASE_CONNECTION]
  },
  {
    provide: ORDER_REPOSITORY,
    useClass: OrderRepository
  },
  {
    provide: ORDER_ITEM_REPOSITORY,
    useClass: OrderItemRepository
  }
];
