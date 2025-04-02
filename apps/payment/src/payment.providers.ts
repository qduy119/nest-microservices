import { Provider } from '@nestjs/common';
import {
  DATABASE_CONNECTION,
  PAYMENT_MODEL,
  PAYMENT_REPOSITORY
} from './di-token';
import { Connection } from 'mongoose';
import { PaymentSchema } from './payment.schema';
import { PaymentRepository } from './payment.repository';

export const paymentProviders: Provider[] = [
  {
    provide: PAYMENT_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Payment', PaymentSchema),
    inject: [DATABASE_CONNECTION]
  },
  {
    provide: PAYMENT_REPOSITORY,
    useClass: PaymentRepository
  }
];
