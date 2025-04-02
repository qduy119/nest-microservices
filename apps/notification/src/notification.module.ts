import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { AppConfigModule } from './config';
import { notificationProvidets } from './notification.providers';
import { ShareConfigModule } from '@app/shared';

@Module({
  imports: [AppConfigModule, ShareConfigModule],
  controllers: [NotificationController],
  providers: [NotificationService, ...notificationProvidets]
})
export class NotificationModule {}
