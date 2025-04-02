import * as mongoose from 'mongoose';
import { PAYMENT_STATUS } from '@app/shared';

export interface Payment extends mongoose.Document {
  readonly _id: string;
  readonly userId: string;
  readonly orderId: string;
  readonly payDate: Date;
  readonly bankCode: string;
  readonly cardType: string;
  readonly total: number;
  readonly status: PAYMENT_STATUS;
}
