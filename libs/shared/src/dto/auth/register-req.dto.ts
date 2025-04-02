import { IsEmail, IsString } from 'class-validator';

export class RegisterReqDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
