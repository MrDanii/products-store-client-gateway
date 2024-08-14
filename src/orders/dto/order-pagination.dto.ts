import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus, orderStatusList } from "../enum/order.enum";
import { PaginationDto } from "src/common";

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(orderStatusList, {
    message: `Valid Status are: [${orderStatusList}]`
  })
  orderStatus?: OrderStatus
}