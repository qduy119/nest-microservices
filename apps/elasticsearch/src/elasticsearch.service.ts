import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { IElasticSearchService } from './elasticsearch-service.interface';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config';
import { RpcException } from '@nestjs/microservices';
import { IPaginationResponse } from '@app/shared';

@Injectable()
export class ElasticsearchService implements IElasticSearchService {
  private readonly esClient: Client;

  constructor(private readonly configService: ConfigService) {
    const { url, username, password } =
      this.configService.get<AppConfig['elasticsearch']>('elasticsearch');
    this.esClient = new Client({ node: url, auth: { username, password } });
  }

  async createOrUpdateIndex(index: string, documents: any[]): Promise<void> {
    try {
      const operations = documents.flatMap((document) => [
        { index: { _index: index, _id: document.id } },
        document
      ]);

      await this.esClient.bulk({ refresh: true, operations });
    } catch (err) {
      throw new RpcException(err);
    }
  }
  async search(
    index: string,
    query: object,
    limit: number,
    offset: number
  ): Promise<any> {
    try {
      const data = await this.esClient.search({
        index,
        from: offset,
        size: limit,
        body: {
          query
        }
      });
      const hits = data.hits;
      const dataHits = hits.hits.map((item) => item._source);
      const total =
        typeof hits.total === 'number' ? hits.total : hits.total.value;
      const res: IPaginationResponse<any> = {
        data: dataHits,
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
        totalPages: Math.ceil(total / limit)
      };
      return res;
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
