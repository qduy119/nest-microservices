import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { UploadService } from './upload.service';
import { ShareConfigModule } from '@app/shared';

@Module({
  imports: [ShareConfigModule],
  controllers: [FileController],
  providers: [UploadService]
})
export class UploadModule {}
