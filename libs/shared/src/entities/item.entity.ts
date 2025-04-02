import { ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'ItemSchema' })
export class IItemEntity {
  id: number;
  thumbnail: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  images: string[];
  rating: number;
}
