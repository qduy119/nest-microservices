import { Controller, Inject, OnModuleInit, UseFilters } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  ClientGrpc,
  ClientKafka,
  Ctx,
  EventPattern,
  Payload,
  RmqContext
} from '@nestjs/microservices';
import {
  CatchRpcExceptionFilter,
  CREATE_ORDER_EVENT,
  CreateOrderEvent,
  SEND_NOTIFICATION_EVENT
} from '@app/shared';
import { PAYMENT_SERVICE_KAFKA } from './di-token';
import {
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient
} from '@app/shared/proto/user';
import { firstValueFrom } from 'rxjs';

@UseFilters(CatchRpcExceptionFilter)
@Controller('payment')
export class PaymentController implements OnModuleInit {
  private userClientService: UserServiceClient;

  constructor(
    @Inject(PAYMENT_SERVICE_KAFKA) private readonly clientKafka: ClientKafka,
    @Inject(USER_PACKAGE_NAME) private readonly clientGrpc: ClientGrpc,
    private readonly paymentService: PaymentService
  ) {}

  onModuleInit() {
    this.userClientService =
      this.clientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  @EventPattern(CREATE_ORDER_EVENT)
  async handleOrderCreate(
    @Payload() payload: CreateOrderEvent,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { user } = await firstValueFrom(
        this.userClientService.getUserById({ id: payload.userId })
      );
      const payment = await this.paymentService.createPayment(payload);
      this.clientKafka.emit(SEND_NOTIFICATION_EVENT, {
        subject: 'New Payment ⚡',
        content: `You have a new payment id ${payment._id}`,
        to: user.email
      });
      channel.ack(originalMsg);
    } catch (error) {
      console.log('Error payment: ', error);
      channel.nack(originalMsg, false, true);
    }
  }
}
