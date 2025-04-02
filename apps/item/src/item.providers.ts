import { Provider } from '@nestjs/common';
import { ITEM_REPOSITORY, ITEM_MODEL } from './di-token';
import { ItemModel } from './item.model';
import { ItemRepository } from './item.repository';

export const itemProviders: Provider[] = [
  {
    provide: ITEM_MODEL,
    useValue: ItemModel
  },
  {
    provide: ITEM_REPOSITORY,
    useClass: ItemRepository
  }
];
