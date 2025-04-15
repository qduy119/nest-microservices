import { Controller, Inject, OnModuleInit, UseFilters } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  ClientGrpc,
  ClientRMQ,
  Ctx,
  EventPattern,
  Payload,
  RmqContext
} from '@nestjs/microservices';
import {
  CatchRpcExceptionFilter,
  CREATE_ORDER_PAYMENT_EVENT,
  CreateOrderEvent,
  PAYMENT_STATUS,
  PROCESS_PAYMENT_FAILED_EVENT,
  SEND_NOTIFICATION_EVENT
} from '@app/shared';
import {
  PAYMENT_SERVICE_ITEM_RABBITMQ,
  PAYMENT_SERVICE_MAIL_RABBITMQ
} from './di-token';
import {
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient
} from '@app/shared/proto/user';
import { firstValueFrom } from 'rxjs';
import { Payment } from './payment.interface';

@UseFilters(CatchRpcExceptionFilter)
@Controller('payment')
export class PaymentController implements OnModuleInit {
  private userClientService: UserServiceClient;

  constructor(
    @Inject(PAYMENT_SERVICE_MAIL_RABBITMQ)
    private readonly clientNotification: ClientRMQ,
    @Inject(USER_PACKAGE_NAME) private readonly clientGrpc: ClientGrpc,
    @Inject(PAYMENT_SERVICE_ITEM_RABBITMQ)
    private readonly clientItem: ClientRMQ,
    private readonly paymentService: PaymentService
  ) {}

  onModuleInit() {
    this.userClientService =
      this.clientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  @EventPattern(CREATE_ORDER_PAYMENT_EVENT)
  async handleOrderCreate(
    @Payload() payload: CreateOrderEvent,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    let payment: Payment = null;

    try {
      const { user } = await firstValueFrom(
        this.userClientService.getUserById({ id: payload.userId })
      );
      payment = await this.paymentService.createPayment(payload);
      this.clientNotification.emit(SEND_NOTIFICATION_EVENT, {
        subject: 'New Payment ⚡',
        content: `You have a new payment id ${payment._id}`,
        to: user.email
      });
      channel.ack(originalMsg);
    } catch (error) {
      console.log('Error payment: ', error);
      channel.nack(originalMsg, false, false);
      if (payment) {
        await this.paymentService.updatePayment(payment._id, {
          status: PAYMENT_STATUS.ERROR
        });
      }
      this.clientItem.emit(PROCESS_PAYMENT_FAILED_EVENT, {
        ...payload
      });
    }
  }
}
