import { GENDER } from '@app/shared/constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class RegisterReqDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-+=^.]).{8,20}$/, {
    message:
      'Password must be 8-20 characters, include at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*()-+=^.)'
  })
  password: string;

  @IsString()
  @ApiProperty()
  fullName: string;

  @IsEnum(GENDER)
  @IsOptional()
  @ApiProperty()
  gender?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  avatar?: string;
}
