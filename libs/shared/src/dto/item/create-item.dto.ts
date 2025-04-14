import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min
} from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount: number;
  @IsNumber()
  @IsPositive()
  stock: number;
}
