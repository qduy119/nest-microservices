import { IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  itemId: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}
