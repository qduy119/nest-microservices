import { ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'OrderItemSchema' })
export class IOrderItemEntity {
  id: string;
  quantity: number;
  price: number;
  itemId: number;
  orderId: string;
}
