import { IPaginatedParam, IPaginationResponse, IRepository } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { Payment } from './payment.interface';
import { PAYMENT_MODEL } from './di-token';

@Injectable()
export class PaymentRepository implements IRepository<Payment> {
  constructor(
    @Inject(PAYMENT_MODEL) private readonly paymentModel: Model<Payment>
  ) {}

  async findAll(
    filter?: Partial<Payment>,
    paginatedParam?: IPaginatedParam
  ): Promise<IPaginationResponse<Payment[]>> {
    const query = this.paymentModel.find(filter as FilterQuery<Payment>);

    if (!paginatedParam) {
      return { data: await query.exec() };
    }
    const total = await this.paymentModel.countDocuments(
      filter as FilterQuery<Payment>
    );

    const { page, limit } = paginatedParam;
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
  findOne(filter?: Partial<Payment>): Promise<Payment> {
    return this.paymentModel.findOne(filter as FilterQuery<Payment>).exec();
  }
  create(payload: Partial<Payment>): Promise<Payment> {
    const created = new this.paymentModel(payload);
    return created.save();
  }
  async update(
    id: string,
    payload: Partial<Payment>
  ): Promise<{ success: boolean }> {
    const res = await this.paymentModel
      .updateOne({ _id: id }, { $set: payload })
      .exec();
    return {
      success: res.modifiedCount > 0
    };
  }
  async remove(id: string): Promise<{ success: boolean }> {
    const res = await this.paymentModel.deleteOne({ _id: id }).exec();
    return {
      success: res.deletedCount > 0
    };
  }
}
