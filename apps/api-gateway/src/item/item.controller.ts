import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Req
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators';
import { CreateIndexDto, IItemEntity, SearchItemQuery } from '@app/shared';
import { ITEM_SERVICE_CLIENT } from './di-token';
import { ItemServiceClient } from '@app/shared/proto/item';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

@ApiExtraModels(IItemEntity)
@ApiBearerAuth()
@ApiTags('Item')
@Controller('item')
export class ItemController {
  constructor(
    @Inject(ITEM_SERVICE_CLIENT)
    private readonly itemServiceClient: ItemServiceClient
  ) {}

  @Public()
  @Get('search-elastic')
  @HttpCode(200)
  search(@Req() req: Request) {
    const query = req.query as unknown as SearchItemQuery;
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
