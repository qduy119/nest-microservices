import * as mongoose from 'mongoose';
import { ORDER_STATUS } from '@app/shared';

export interface Order extends mongoose.Document {
  readonly _id: string;
  readonly orderDate: Date;
  readonly total: number;
  readonly status: ORDER_STATUS;
  readonly userId: string;
}
