import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ShareConfigModule } from '@app/shared';

@Module({
  imports: [ShareConfigModule],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
