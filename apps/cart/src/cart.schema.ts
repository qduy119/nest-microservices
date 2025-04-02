import * as mongoose from 'mongoose';

export const CartSchema = new mongoose.Schema({
  id: mongoose.Types.ObjectId,
  userId: mongoose.Types.UUID,
  itemId: Number,
  quantity: Number
});
