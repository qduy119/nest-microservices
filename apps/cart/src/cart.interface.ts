import * as mongoose from 'mongoose';

export interface Cart extends mongoose.Document {
  readonly id: string;
  readonly userId: string;
  readonly itemId: number;
  readonly quantity: number;
}
