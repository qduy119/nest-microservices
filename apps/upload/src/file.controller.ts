import { Controller, UseFilters } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CatchRpcExceptionFilter } from '@app/shared';
import {
  UploadFileRequest,
  UploadFileResponse,
  UploadServiceController,
  UploadServiceControllerMethods
} from '@app/shared/proto/upload';
import { Observable } from 'rxjs';

@UseFilters(CatchRpcExceptionFilter)
@UploadServiceControllerMethods()
@Controller('upload')
export class FileController implements UploadServiceController {
  constructor(private readonly fileService: UploadService) {}

  uploadFile(
    request: UploadFileRequest
  ):
    | Promise<UploadFileResponse>
    | Observable<UploadFileResponse>
    | UploadFileResponse {
    const file = request.file as Express.Multer.File;
    return this.fileService.upload(file, request.folder);
  }
}
