import { IPaginatedParam, IPaginationResponse, IRepository } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { UserModel } from './user.model';
import { USER_MODEL } from './di-token';

@Injectable()
export class UserRepository implements IRepository<UserModel> {
  constructor(@Inject(USER_MODEL) private userModel: typeof UserModel) {}

  async findAll(
    filter?: Partial<UserModel>,
    paginatedParam?: IPaginatedParam
  ): Promise<IPaginationResponse<UserModel[]>> {
    if (!paginatedParam) {
      const data = await this.userModel.findAll({ where: filter });
      return { data };
    }
    const { page, limit } = paginatedParam;
    const { rows: data, count: total } = await this.userModel.findAndCountAll({
      where: filter,
      offset: (page - 1) * limit,
      limit
    });
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
  findOne(filter?: Partial<UserModel>): Promise<UserModel> {
    return this.userModel.findOne({ where: filter });
  }
  async create(payload: Partial<UserModel>): Promise<UserModel> {
    const data = await this.userModel.create(payload);
    return data;
  }
  async update(
    id: any,
    payload: Partial<UserModel>
  ): Promise<{ success: boolean }> {
    const [rowsUpdate] = await this.userModel.update(payload, {
      where: { id }
    });
    return { success: rowsUpdate > 0 };
  }
  async remove(id: any): Promise<{ success: boolean }> {
    const rowsDelete = await this.userModel.destroy({ where: { id } });
    return { success: rowsDelete > 0 };
  }
}
