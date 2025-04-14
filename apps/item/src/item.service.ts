import { Inject, Injectable } from '@nestjs/common';
import { ELASTIC_SERVICE_RABBITMQ, ITEM_REPOSITORY } from './di-token';
import { IItemRepository } from './item.repository';
import { ClientRMQ } from '@nestjs/microservices';
import {
  ELASTIC_CREATE_INDEX_EVENT,
  ELASTIC_GET_SEARCH_EVENT
} from '@app/shared';
import { Item } from '@app/shared/proto/item';
import { map } from 'rxjs';

@Injectable()
export class ItemService {
  constructor(
    @Inject(ITEM_REPOSITORY)
    private readonly itemRepository: IItemRepository,
    @Inject(ELASTIC_SERVICE_RABBITMQ) private readonly client: ClientRMQ
  ) {}

  decrease({ itemId, quantity }: { itemId: number; quantity: number }) {
    return this.itemRepository.decreaseQuantity({ itemId, quantity });
  }
  increase({ itemId, quantity }: { itemId: number; quantity: number }) {
    return this.itemRepository.increaseQuantity({ itemId, quantity });
  }
  search(data: {
    index: string;
    query: string;
    fields: string[];
    limit: number;
    offset: number;
  }) {
    return this.client
      .send(ELASTIC_GET_SEARCH_EVENT, { ...data })
      .pipe(map((items) => ({ items })));
  }
  createIndex(data: { index: string; documents: Item[] }) {
    return this.client.emit(ELASTIC_CREATE_INDEX_EVENT, { ...data });
  }
  async getAll() {
    const data = await this.itemRepository.findAll();
    return { items: data.data };
  }
  async create(payload: Partial<Item>) {
    const created = await this.itemRepository.create(payload);
    const elasticItem = {
      index: 'products',
      documents: [created]
    };
    this.client.emit(ELASTIC_CREATE_INDEX_EVENT, { ...elasticItem });
    return created;
  }
}
