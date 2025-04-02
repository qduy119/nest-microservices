import { IsString } from 'class-validator';

export class VerifyTokenDto {
  @IsString()
  accessToken: string;
}
