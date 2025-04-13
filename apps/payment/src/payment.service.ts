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
    const { orderId, total, userId } = payload;
    const data = await this.paymentRepository.create({
      orderId,
      total,
      userId
    });
    return data;
  }

  async updatePayment(id: string, payload: Partial<Payment>) {
    return this.paymentRepository.update(id, payload);
  }
}
