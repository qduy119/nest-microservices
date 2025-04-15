import { Controller, Inject } from '@nestjs/common';
import { Ctx, RmqContext, EventPattern, Payload } from '@nestjs/microservices';
import { SEND_NOTIFICATION_EVENT, SendNotificationEvent } from '@app/shared';
import { INotificationService } from './notification-service.interface';
import { NOTIFICATION_SERVICE } from './di-token';

@Controller()
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: INotificationService
  ) {}

  @EventPattern(SEND_NOTIFICATION_EVENT)
  async sendNotification(
    @Payload() payload: SendNotificationEvent,
    @Ctx() context: RmqContext
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.notificationService.send(payload);
      channel.ack(originalMsg);
    } catch (error) {
      console.log(error);
      channel.nack(originalMsg, false, true);
    }
  }
}
