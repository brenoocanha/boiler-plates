import { Type } from 'class-transformer';
import {
  IsEmail,
  IsObject,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class AddressDto {
  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  line1: string;

  @IsString()
  line2: string;

  @IsString()
  postal_code: string;

  @IsString()
  state: string;
}

export class SignUpDto {
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  cpfCnpj: string;

  @IsString()
  phone: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 character long' })
  @MaxLength(32, { message: 'Password must be at most 32 character long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too weak. Password must have at least: 1 upper case letter, 1 lower case letter, 1 number or special character',
  })
  password: string;

  @ValidateNested()
  @IsObject()
  @Type(() => AddressDto)
  address: AddressDto;
}
