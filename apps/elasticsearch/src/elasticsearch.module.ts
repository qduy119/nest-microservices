import { Module } from '@nestjs/common';
import { ElasticsearchController } from './elasticsearch.controller';
import { ElasticsearchService } from './elasticsearch.service';
import { elasticsearchProviders } from './elasticsearch.providers';
import { AppConfigModule } from './config';
import { ShareConfigModule } from '@app/shared';

@Module({
  imports: [AppConfigModule, ShareConfigModule],
  controllers: [ElasticsearchController],
  providers: [...elasticsearchProviders, ElasticsearchService]
})
export class ElasticsearchModule {}
