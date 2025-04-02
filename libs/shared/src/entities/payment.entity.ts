import { ApiSchema } from '@nestjs/swagger';
import { PAYMENT_STATUS } from '../constants';

@ApiSchema({ name: 'PaymentSchema' })
export class IPaymentEntity {
  id: string;
  userId: string;
  orderId: number;
  payDate: Date;
  bankCode: string;
  cardType: string;
  amount: number;
  status: PAYMENT_STATUS;
}
