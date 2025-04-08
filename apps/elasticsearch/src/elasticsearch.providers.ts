import { Provider } from '@nestjs/common';
import { ELASTIC_SERVICE } from './di-token';
import { ElasticsearchService } from './elasticsearch.service';

export const elasticsearchProviders: Provider[] = [
  {
    provide: ELASTIC_SERVICE,
    useClass: ElasticsearchService
  }
];
