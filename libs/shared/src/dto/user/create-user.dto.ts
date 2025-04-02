import { GENDER, PROVIDER, ROLE } from '@app/shared/constants';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEnum(GENDER)
  @IsOptional()
  gender?: GENDER;

  @IsEnum(PROVIDER)
  @IsOptional()
  provider?: PROVIDER;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsEnum(ROLE)
  @IsOptional()
  roles?: ROLE[];
}
