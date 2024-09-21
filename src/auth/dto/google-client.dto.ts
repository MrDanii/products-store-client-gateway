import { IsEmail, IsOptional, IsString, MinLength } from "class-validator"

export class GoogleClientDto {
  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @MinLength(1)
  firstName: string
  
  @IsString()
  lastName: string
  
  @IsOptional()
  @IsString()
  @MinLength(1)
  picture: string
}