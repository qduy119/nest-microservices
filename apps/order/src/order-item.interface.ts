import * as mongoose from 'mongoose';

export interface OrderItem extends mongoose.Document {
  readonly _id: string;
  readonly itemId: number;
  readonly orderId: string;
  readonly quantity: number;
  readonly price: number;
}
