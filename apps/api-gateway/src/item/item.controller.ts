import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators';
import { CreateIndexDto, IItemEntity, SearchItemQuery } from '@app/shared';
import { firstValueFrom } from 'rxjs';
import { ItemService } from './item.service';

@ApiExtraModels(IItemEntity)
@ApiBearerAuth()
@ApiTags('Item')
@Controller('item')
export class ItemController {
  constructor(private readonly itemServiceClient: ItemService) {}

  @Public()
  @Get('search-elastic')
  @HttpCode(200)
  search(@Query() query: SearchItemQuery) {
    const data = this.itemServiceClient.searchItem(query);
    return firstValueFrom(data);
  }

  // @Roles(ROLE.ADMIN)
  @Public()
  @Post('create-index')
  @HttpCode(200)
  async createIndex(@Body() createIndexDto: CreateIndexDto) {
    const { items: documents } = await firstValueFrom(
      this.itemServiceClient.getAll({})
    );
    const data = this.itemServiceClient.createIndex({
      ...createIndexDto,
      documents
    });
    return firstValueFrom(data);
  }
}
