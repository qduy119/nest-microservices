import { GENDER, PROVIDER, ROLE } from '@app/shared/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  id?: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsOptional()
  @ApiProperty()
  password?: string;

  @IsString()
  @ApiProperty()
  fullName: string;

  @IsEnum(GENDER)
  @IsOptional()
  @ApiProperty()
  gender?: GENDER;

  @ApiProperty()
  @IsEnum(PROVIDER)
  @IsOptional()
  provider?: PROVIDER;

  @IsString()
  @ApiProperty()
  @IsOptional()
  avatar?: string;

  @IsEnum(ROLE)
  @IsOptional()
  @ApiProperty()
  roles?: ROLE[];
}
