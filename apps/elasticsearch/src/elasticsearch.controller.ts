import { Controller, Inject } from '@nestjs/common';
import { ELASTIC_SERVICE } from './di-token';
import { IElasticSearchService } from './elasticsearch-service.interface';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  KafkaContext,
  RpcException
} from '@nestjs/microservices';
import {
  CreateOrUpdateIndexEvent,
  ELASTIC_CREATE_INDEX_EVENT,
  ELASTIC_GET_SEARCH_EVENT,
  GetSearchEvent
} from '@app/shared';

@Controller()
export class ElasticsearchController {
  constructor(
    @Inject(ELASTIC_SERVICE)
    private readonly elasticsearchService: IElasticSearchService
  ) {}

  @EventPattern(ELASTIC_CREATE_INDEX_EVENT)
  async createOrUpdateIndex(
    @Payload() payload: CreateOrUpdateIndexEvent,
    @Ctx() context: KafkaContext
  ): Promise<void> {
    try {
      console.log(context.getMessage());
      const { documents, index } = payload;
      await this.elasticsearchService.createOrUpdateIndex(index, documents);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern(ELASTIC_GET_SEARCH_EVENT)
  async search(
    @Payload() payload: GetSearchEvent,
    @Ctx() context: KafkaContext
  ): Promise<any> {
    try {
      console.log(payload, context.getMessage());
      const { index, query, fields, offset, limit } = payload;
      const searchQuery = {
        multi_match: {
          query,
          fields,
          fuzziness: 'AUTO'
        }
      };
      const data = await this.elasticsearchService.search(
        index,
        searchQuery,
        limit,
        offset
      );
      return data;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
