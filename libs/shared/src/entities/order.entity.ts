import { ApiSchema } from '@nestjs/swagger';
import { ORDER_STATUS } from '../constants';

@ApiSchema({ name: 'OrderSchema' })
export class IOrderEntity {
  id: string;
  orderDate: Date;
  total: number;
  status: ORDER_STATUS;
  userId: string;
}
