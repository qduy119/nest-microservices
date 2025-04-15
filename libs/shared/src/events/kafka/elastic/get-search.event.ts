export interface GetSearchEvent {
  index: string;
  query: string;
  fields: string[];
  limit: number;
  offset: number;
}
