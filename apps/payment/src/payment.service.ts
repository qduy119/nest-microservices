import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderEvent, IRepository } from '@app/shared';
import { PAYMENT_REPOSITORY } from './di-token';
import { Payment } from './payment.interface';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IRepository<Payment>
  ) {}

  async createPayment(payload: CreateOrderEvent) {
    const data = await this.paymentRepository.create(payload);
    return data;
  }
}
