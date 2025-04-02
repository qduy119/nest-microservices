import { ORDER_STATUS } from '@app/shared';
import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  userId: mongoose.Types.UUID,
  orderDate: {
    type: Date,
    default: Date.now()
  },
  total: Number,
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING
  }
});
