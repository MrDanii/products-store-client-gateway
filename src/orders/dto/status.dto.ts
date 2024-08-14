import { IsEnum, IsOptional, IsString } from "class-validator";
import { OrderStatus, orderStatusList } from "../enum/order.enum";

export class StatusDto {  
  @IsEnum(orderStatusList, {
    message: `valid status are: [${orderStatusList}]`
  })
  orderStatus: OrderStatus
}