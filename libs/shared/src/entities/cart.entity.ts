import { ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'CartSchema' })
export class ICartEntity {
  id: string;
  quantity: number;
  userId: string;
  itemId: number;
}
