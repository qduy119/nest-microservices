import { Controller, UseFilters } from '@nestjs/common';
import { ItemService } from './item.service';
import {
  CreateIndexRequest,
  CreateIndexResponse,
  DecreaseQuantityRequest,
  DecreaseQuantityResponse,
  GetAllItemsRequest,
  GetAllItemsResponse,
  ItemServiceController,
  ItemServiceControllerMethods,
  SearchItemRequest,
  SearchItemResponse
} from '@app/shared/proto/item';
import { from, Observable } from 'rxjs';
import { CatchRpcExceptionFilter } from '@app/shared';

@UseFilters(CatchRpcExceptionFilter)
@ItemServiceControllerMethods()
@Controller('item')
export class ItemController implements ItemServiceController {
  constructor(private readonly itemService: ItemService) {}
  searchItem(
    request: SearchItemRequest
  ):
    | Promise<SearchItemResponse>
    | Observable<SearchItemResponse>
    | SearchItemResponse {
    return from(this.itemService.search(request));
  }
  decreaseQuantity(
    request: DecreaseQuantityRequest
  ):
    | Promise<DecreaseQuantityResponse>
    | Observable<DecreaseQuantityResponse>
    | DecreaseQuantityResponse {
    return from(this.itemService.decrease(request));
  }
  createIndex(
    request: CreateIndexRequest
  ):
    | Promise<CreateIndexResponse>
    | Observable<CreateIndexResponse>
    | CreateIndexResponse {
    return from(this.itemService.createIndex(request));
  }
  getAll(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: GetAllItemsRequest
  ):
    | Promise<GetAllItemsResponse>
    | Observable<GetAllItemsResponse>
    | GetAllItemsResponse {
    return from(this.itemService.getAll());
  }
}
