import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLabDto {
  @IsNotEmpty()
  structure: string;

  @IsOptional()
  @IsString()
  latLng?: string; // Format: "lat,lng"

  @IsNotEmpty()
  director: string;

  @IsNotEmpty()
  responsible: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  email: string;
}
