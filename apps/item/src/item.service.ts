import { Inject, Injectable } from '@nestjs/common';
import { ITEM_REPOSITORY } from './di-token';
import { ItemRepository } from './item.repository';

@Injectable()
export class ItemService {
  constructor(
    @Inject(ITEM_REPOSITORY) private readonly itemRepository: ItemRepository
  ) {}

  decrease({ itemId, quantity }: { itemId: number; quantity: number }) {
    return this.itemRepository.decreaseQuantity({ itemId, quantity });
  }
}
