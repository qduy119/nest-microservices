import * as mongoose from 'mongoose';

export const OrderItemSchema = new mongoose.Schema({
  itemId: Number,
  orderId: mongoose.Types.ObjectId,
  quantity: Number,
  price: Number
});
