import { IsOptional, IsString } from "class-validator"

export class FindAddressDto {
  @IsString()
  @IsOptional()
  idUser: string

  @IsString()
  idUserAddress: string
}