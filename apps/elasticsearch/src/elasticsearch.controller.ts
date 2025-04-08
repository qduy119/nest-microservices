import { Controller, Inject } from '@nestjs/common';
import { ELASTIC_SERVICE } from './di-token';
import { IElasticSearchService } from './elasticsearch-service.interface';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext
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
    @Ctx() context: RmqContext
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { documents, index } = payload;
      await this.elasticsearchService.createOrUpdateIndex(index, documents);
      channel.ack(originalMsg);
    } catch (error) {
      console.log('Create error: ', error);
      channel.nack(originalMsg, false, true);
    }
  }

  @MessagePattern(ELASTIC_GET_SEARCH_EVENT)
  async search(
    @Payload() payload: GetSearchEvent,
    @Ctx() context: RmqContext
  ): Promise<any> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
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
      channel.ack(originalMsg);
      return data;
    } catch (error) {
      console.log('Create error: ', error);
      channel.nack(originalMsg, false, true);
    }
  }
}
