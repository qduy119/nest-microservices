import { PAYMENT_STATUS } from '@app/shared';
import * as mongoose from 'mongoose';

export const PaymentSchema = new mongoose.Schema({
  userId: mongoose.Types.UUID,
  orderId: mongoose.Types.ObjectId,
  payDate: Date,
  bankCode: String,
  cardType: String,
  total: Number,
  status: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING
  }
});
