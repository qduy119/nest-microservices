export interface IElasticSearchService {
  createOrUpdateIndex(index: string, documents: any[]): Promise<void>;
  search(
    index: string,
    query: object,
    limit: number,
    offset: number
  ): Promise<any>;
}
