import { ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'OrderSchema' })
export class IOrderItem {
  id: string;
  quantity: number;
  price: number;
  itemId: number;
  orderId: string;
}
