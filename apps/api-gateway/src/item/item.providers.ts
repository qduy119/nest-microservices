import { Provider } from '@nestjs/common';
import { ITEM_SERVICE_CLIENT } from './di-token';
import { ItemService } from './item.service';

export const itemProviders: Provider[] = [
  {
    provide: ITEM_SERVICE_CLIENT,
    useClass: ItemService
  }
];
