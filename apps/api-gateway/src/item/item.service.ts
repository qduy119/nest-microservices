import {
  UPLOAD_PACKAGE_NAME,
  UPLOAD_SERVICE_NAME,
  UploadFileRequest,
  UploadFileResponse,
  UploadServiceClient
} from '@app/shared/proto/upload';
import {
  CreateIndexRequest,
  CreateIndexResponse,
  CreateItemRequest,
  CreateItemResponse,
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
export class ItemService implements OnModuleInit {
  private itemService: ItemServiceClient;
  private uploadService: UploadServiceClient;

  constructor(
    @Inject(ITEM_PACKAGE_NAME) private readonly client: ClientGrpc,
    @Inject(UPLOAD_PACKAGE_NAME) private readonly clientUpload: ClientGrpc
  ) {}

  onModuleInit() {
    this.itemService =
      this.client.getService<ItemServiceClient>(ITEM_SERVICE_NAME);
    this.uploadService =
      this.clientUpload.getService<UploadServiceClient>(UPLOAD_SERVICE_NAME);
  }

  searchItem(request: SearchItemRequest): Observable<SearchItemResponse> {
    return this.itemService.searchItem(request);
  }

  createIndex(request: CreateIndexRequest): Observable<CreateIndexResponse> {
    return this.itemService.createIndex(request);
  }

  getAll(request: GetAllItemsRequest): Observable<GetAllItemsResponse> {
    return this.itemService.getAll(request);
  }

  uploadFile(request: UploadFileRequest): Observable<UploadFileResponse> {
    return this.uploadService.uploadFile(request);
  }

  createItem(request: CreateItemRequest): Observable<CreateItemResponse> {
    return this.itemService.createItem(request);
  }
}
