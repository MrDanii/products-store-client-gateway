import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { ShoppingCartDetailsDto } from "./shopping-cart-details.dto";
import { Type } from "class-transformer";

export class CreateCartDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ShoppingCartDetailsDto)
  items: ShoppingCartDetailsDto[]
}
