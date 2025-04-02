import { Provider } from '@nestjs/common';
import { NOTIFICATION_SERVICE } from './di-token';
import { NotificationService } from './notification.service';

export const notificationProvidets: Provider[] = [
  {
    provide: NOTIFICATION_SERVICE,
    useClass: NotificationService
  }
];
