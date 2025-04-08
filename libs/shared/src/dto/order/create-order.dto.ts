import { IsNotEmpty } from 'class-validator';

interface IOrderItem {
  quantity: number;
  price: number;
  itemId: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  orderItems: IOrderItem[];
}
