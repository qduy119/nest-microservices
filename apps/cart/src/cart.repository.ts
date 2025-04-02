import { IPaginatedParam, IPaginationResponse, IRepository } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { Cart } from './cart.interface';
import { CART_MODEL } from './di-token';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class CartRepository implements IRepository<Cart> {
  constructor(@Inject(CART_MODEL) private readonly cartModel: Model<Cart>) {}

  async findAll(
    filter?: Partial<Cart>,
    paginatedParam?: IPaginatedParam
  ): Promise<IPaginationResponse<Cart[]>> {
    const query = this.cartModel.find(filter as FilterQuery<Cart>);

    if (!paginatedParam) {
      return { data: await query.exec() };
    }
    const total = await this.cartModel.countDocuments(
      filter as FilterQuery<Cart>
    );

    const { page, limit } = paginatedParam;
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
  findOne(filter?: Partial<Cart>): Promise<Cart> {
    return this.cartModel.findOne(filter as FilterQuery<Cart>).exec();
  }
  create(payload: Partial<Cart>): Promise<Cart> {
    const created = new this.cartModel(payload);
    return created.save();
  }
  async update(
    id: string,
    payload: Partial<Cart>
  ): Promise<{ success: boolean }> {
    const res = await this.cartModel
      .updateOne({ _id: id }, { $set: payload })
      .exec();
    return {
      success: res.modifiedCount > 0
    };
  }
  async remove(id: string): Promise<{ success: boolean }> {
    const res = await this.cartModel.deleteOne({ _id: id }).exec();
    return {
      success: res.deletedCount > 0
    };
  }
}
