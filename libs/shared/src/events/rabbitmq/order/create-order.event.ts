export interface CreateOrderEvent {
  orderItems: {
    itemId: number;
    quantity: number;
  }[];
  userId: string;
  orderId: string;
  total: number;
}
