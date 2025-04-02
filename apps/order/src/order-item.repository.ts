import { IPaginatedParam, IPaginationResponse, IRepository } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { OrderItem } from './order-item.interface';
import { ORDER_ITEM_MODEL } from './di-token';

@Injectable()
export class OrderItemRepository implements IRepository<OrderItem> {
  constructor(
    @Inject(ORDER_ITEM_MODEL) private readonly orderItemModel: Model<OrderItem>
  ) {}

  async findAll(
    filter?: Partial<OrderItem>,
    paginatedParam?: IPaginatedParam
  ): Promise<IPaginationResponse<OrderItem[]>> {
    const query = this.orderItemModel.find(filter as FilterQuery<OrderItem>);

    if (!paginatedParam) {
      return { data: await query.exec() };
    }
    const total = await this.orderItemModel.countDocuments(
      filter as FilterQuery<OrderItem>
    );

    const { page, limit } = paginatedParam;
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
  findOne(filter?: Partial<OrderItem>): Promise<OrderItem> {
    return this.orderItemModel.findOne(filter as FilterQuery<OrderItem>).exec();
  }
  create(payload: Partial<OrderItem>): Promise<OrderItem> {
    const created = new this.orderItemModel(payload);
    return created.save();
  }
  async update(
    id: string,
    payload: Partial<OrderItem>
  ): Promise<{ success: boolean }> {
    const res = await this.orderItemModel
      .updateOne({ _id: id }, { $set: payload })
      .exec();
    return {
      success: res.modifiedCount > 0
    };
  }
  async remove(id: string): Promise<{ success: boolean }> {
    const res = await this.orderItemModel.deleteOne({ _id: id }).exec();
    return {
      success: res.deletedCount > 0
    };
  }
}
