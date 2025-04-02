export class CreateOrderDto {
  orderItems: {
    quantity: number;
    price: number;
    itemId: number;
  }[];
}
