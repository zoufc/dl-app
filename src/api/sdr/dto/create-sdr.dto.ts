import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSdrDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsNotEmpty()
  @IsString()
  adminFirstname: string;

  @IsNotEmpty()
  @IsString()
  adminLastname: string;

  @IsOptional()
  @IsString()
  description?: string;
}
