import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsUUID()
  @IsOptional()
  idUser: string

  @IsUUID()
  idProduct: string

  @IsInt()
  @Min(0)
  quantity: number
}
