import { ParseBoolPipe } from "@nestjs/common"
import { Transform, Type } from "class-transformer"
import { IsBoolean, IsNumber, IsOptional, IsPositive } from "class-validator"

export class GetCloudinaryImageDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  optimizeImage: boolean

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  width: number

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  height: number 
}

const optionalBooleanMapper = new Map([
  ['undefined', undefined],
  ['true', true],
  ['false', false],
]);