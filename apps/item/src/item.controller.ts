import { Controller, UseFilters } from '@nestjs/common';
import { ItemService } from './item.service';
import {
  DecreaseQuantityRequest,
  DecreaseQuantityResponse,
  ItemServiceController,
  ItemServiceControllerMethods
} from '@app/shared/proto/item';
import { from, Observable } from 'rxjs';
import { CatchRpcExceptionFilter } from '@app/shared';

@UseFilters(CatchRpcExceptionFilter)
@ItemServiceControllerMethods()
@Controller('item')
export class ItemController implements ItemServiceController {
  constructor(private readonly itemService: ItemService) {}
  decreaseQuantity(
    request: DecreaseQuantityRequest
  ):
    | Promise<DecreaseQuantityResponse>
    | Observable<DecreaseQuantityResponse>
    | DecreaseQuantityResponse {
    return from(this.itemService.decrease(request));
  }
}
