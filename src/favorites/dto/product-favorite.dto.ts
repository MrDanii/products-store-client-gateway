import { IsOptional, IsUUID } from "class-validator"

export class ProductFavoriteDto {
  @IsUUID()
  @IsOptional()
  idUser?: string

  @IsUUID()
  productId: string // productId that will be added to the list of favorites
}
