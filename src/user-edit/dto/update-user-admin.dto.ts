import { PartialType } from "@nestjs/mapped-types"
import { ArrayMinSize, IsArray, IsOptional, IsString, IsUUID, MinLength } from "class-validator"
import { UpdateUserDto } from "./update-user.dto"

export class UpdateUserAdminDto extends PartialType(UpdateUserDto) {
  @IsUUID()
  idUser2: string
  
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  roles: string[] = ['user']

  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string
}