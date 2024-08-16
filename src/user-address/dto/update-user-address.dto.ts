import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAddressDto } from './create-user-address.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserAddressDto extends PartialType(CreateUserAddressDto) {
  @IsString()
  @IsOptional()
  idUserAddress?: string
}
