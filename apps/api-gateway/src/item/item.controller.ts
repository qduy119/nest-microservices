import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators';
import {
  CreateIndexDto,
  CreateItemDto,
  IItemEntity,
  SearchItemQuery
} from '@app/shared';
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

  // @Roles(ROLE.ADMIN)
  @Public()
  @Post('create')
  @HttpCode(200)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 }
      ],
      {
        limits: {
          fileSize: 10 * 1024 * 1024 // 10MB
        }
      }
    )
  )
  async createItem(
    @Body() payload: CreateItemDto,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      images?: Express.Multer.File[];
    }
  ) {
    console.log(files);
    if (!files.thumbnail || !files.thumbnail.length) {
      throw new BadRequestException('No upload thumbnail');
    }
    if (!files.images || !files.images.length) {
      throw new BadRequestException('No upload images');
    }
    const thumbnailFile = files.thumbnail[0];
    const imagesFiles = files.images;

    const thumbnailPromise = firstValueFrom(
      this.itemServiceClient.uploadFile({
        file: thumbnailFile,
        folder: 'upload'
      })
    );
    const imagesPromise = imagesFiles.map(async (imageFile) => {
      return firstValueFrom(
        this.itemServiceClient.uploadFile({
          file: imageFile,
          folder: 'upload'
        })
      );
    });
    const [thumbnailRes, imagesRes] = await Promise.all([
      thumbnailPromise,
      Promise.all(imagesPromise)
    ]);
    const thumbnail = thumbnailRes.secureUrl;
    const images = imagesRes.map((image) => image.secureUrl);

    return firstValueFrom(
      this.itemServiceClient.createItem({ ...payload, thumbnail, images })
    );
  }
}
