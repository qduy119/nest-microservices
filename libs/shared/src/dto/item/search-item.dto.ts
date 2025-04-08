import { IsArray, IsNumber, IsString } from 'class-validator';

export class SearchItemQuery {
  @IsString()
  index: string;
  @IsString()
  query: string;
  @IsArray()
  @IsString({ each: true })
  fields: string[];
  @IsNumber()
  limit: number;
  @IsNumber()
  offset: number;
}
