import {
  CreateIndexRequest,
  CreateIndexResponse,
  DecreaseQuantityRequest,
  DecreaseQuantityResponse,
  GetAllItemsRequest,
  GetAllItemsResponse,
  ITEM_PACKAGE_NAME,
  ITEM_SERVICE_NAME,
  ItemServiceClient,
  SearchItemRequest,
  SearchItemResponse
} from '@app/shared/proto/item';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class ItemService implements OnModuleInit, ItemServiceClient {
  private itemService: ItemServiceClient;

  constructor(@Inject(ITEM_PACKAGE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.itemService =
      this.client.getService<ItemServiceClient>(ITEM_SERVICE_NAME);
  }

  searchItem(request: SearchItemRequest): Observable<SearchItemResponse> {
    return this.itemService.searchItem(request);
  }

  decreaseQuantity(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: DecreaseQuantityRequest
  ): Observable<DecreaseQuantityResponse> {
    throw new Error('Method not implemented.');
  }

  createIndex(request: CreateIndexRequest): Observable<CreateIndexResponse> {
    return this.itemService.createIndex(request);
  }

  getAll(request: GetAllItemsRequest): Observable<GetAllItemsResponse> {
    return this.itemService.getAll(request);
  }
}
