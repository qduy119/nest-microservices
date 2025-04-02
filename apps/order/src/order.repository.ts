import { IPaginatedParam, IPaginationResponse, IRepository } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { Order } from './order.interface';
import { ORDER_MODEL } from './di-token';

@Injectable()
export class OrderRepository implements IRepository<Order> {
  constructor(@Inject(ORDER_MODEL) private readonly orderModel: Model<Order>) {}

  async findAll(
    filter?: Partial<Order>,
    paginatedParam?: IPaginatedParam
  ): Promise<IPaginationResponse<Order[]>> {
    const query = this.orderModel.find(filter as FilterQuery<Order>);

    if (!paginatedParam) {
      return { data: await query.exec() };
    }
    const total = await this.orderModel.countDocuments(
      filter as FilterQuery<Order>
    );

    const { page, limit } = paginatedParam;
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
  findOne(filter?: Partial<Order>): Promise<Order> {
    return this.orderModel.findOne(filter as FilterQuery<Order>).exec();
  }
  create(payload: Partial<Order>): Promise<Order> {
    const created = new this.orderModel(payload);
    return created.save();
  }
  async update(
    id: string,
    payload: Partial<Order>
  ): Promise<{ success: boolean }> {
    const res = await this.orderModel
      .updateOne({ _id: id }, { $set: payload })
      .exec();
    return {
      success: res.modifiedCount > 0
    };
  }
  async remove(id: string): Promise<{ success: boolean }> {
    const res = await this.orderModel.deleteOne({ _id: id }).exec();
    return {
      success: res.deletedCount > 0
    };
  }
}
