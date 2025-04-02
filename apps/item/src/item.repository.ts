import { IPaginatedParam, IPaginationResponse, IRepository } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ItemModel } from './item.model';
import { ITEM_MODEL } from './di-token';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class ItemRepository implements IRepository<ItemModel> {
  constructor(
    @Inject(ITEM_MODEL) private readonly itemModel: typeof ItemModel
  ) {}
  async findAll(
    filter?: Partial<ItemModel>,
    paginatedParam?: IPaginatedParam
  ): Promise<IPaginationResponse<ItemModel[]>> {
    if (!paginatedParam) {
      const data = await this.itemModel.findAll({ where: filter });
      return { data };
    }
    const { page, limit } = paginatedParam;
    const { rows: data, count: total } = await this.itemModel.findAndCountAll({
      where: filter,
      offset: (page - 1) * limit,
      limit
    });
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
  findOne(filter?: Partial<ItemModel>): Promise<ItemModel> {
    return this.itemModel.findOne({ where: filter });
  }
  async create(payload: Partial<ItemModel>): Promise<ItemModel> {
    const data = await this.itemModel.create(payload);
    return data;
  }
  async decreaseQuantity({
    itemId,
    quantity
  }: {
    itemId: number;
    quantity: number;
  }) {
    try {
      const result = await this.itemModel.sequelize.transaction(async (t) => {
        const item = await this.itemModel.findOne({
          where: { id: itemId },
          attributes: ['stock'],
          lock: t.LOCK.UPDATE,
          transaction: t
        });
        if (item.stock < quantity) {
          throw new RpcException({
            status: status.INVALID_ARGUMENT,
            message: "Item's stock is out of range"
          });
        }
        const [rowsUpdate] = await this.itemModel.update(
          {
            stock: item.stock - quantity
          },
          { where: { id: itemId }, transaction: t }
        );
        return { success: rowsUpdate > 0 };
      });
      return result;
    } catch (error) {
      throw new RpcException({ message: error.message });
    }
  }

  async update(
    id: any,
    payload: Partial<ItemModel>
  ): Promise<{ success: boolean }> {
    const [rowsUpdate] = await this.itemModel.update(payload, {
      where: { id }
    });
    return { success: rowsUpdate > 0 };
  }
  async remove(id: any): Promise<{ success: boolean }> {
    const rowsDelete = await this.itemModel.destroy({ where: { id } });
    return { success: rowsDelete > 0 };
  }
}
