import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ELASTIC_SERVICE_KAFKA, ITEM_REPOSITORY } from './di-token';
import { IItemRepository } from './item.repository';
import { ClientKafka } from '@nestjs/microservices';
import {
  ELASTIC_CREATE_INDEX_EVENT,
  ELASTIC_GET_SEARCH_EVENT
} from '@app/shared';
import { Item } from '@app/shared/proto/item';

@Injectable()
export class ItemService implements OnModuleInit {
  constructor(
    @Inject(ITEM_REPOSITORY)
    private readonly itemRepository: IItemRepository,
    @Inject(ELASTIC_SERVICE_KAFKA) private readonly client: ClientKafka
  ) {}

  onModuleInit() {
    this.client.subscribeToResponseOf(ELASTIC_GET_SEARCH_EVENT);
  }

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
    return this.client.send(ELASTIC_GET_SEARCH_EVENT, { ...data });
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
