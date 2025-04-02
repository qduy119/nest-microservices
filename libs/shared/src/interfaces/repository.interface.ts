import { IPaginatedParam } from './paginated-param.interface';
import { IPaginationResponse } from './pagination.response';

export interface IRepository<T> {
  findAll(
    filter?: Partial<T>,
    paginatedParam?: IPaginatedParam
  ): Promise<IPaginationResponse<T[]>>;
  findOne(filter?: Partial<T>): Promise<T | null>;
  create(payload: Partial<T>): Promise<T>;
  update(id: any, payload: Partial<T>): Promise<{ success: boolean }>;
  remove(id: any): Promise<{ success: boolean }>;
}
