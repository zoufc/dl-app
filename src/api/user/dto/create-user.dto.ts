import { IsNotEmpty, IsOptional } from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreateUserDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  lab:string

  @IsOptional()
  regionId:string

  @IsNotEmpty()
  role:string

  @IsNotEmpty()
  identificationType:string

  @IsNotEmpty()
  birthday: string

  @IsNotEmpty()
  nationality:string

  @IsOptional()
  profilePicture:string

  @IsOptional()
  entryDate:Date

  @IsOptional()
  bloodGroup:string
}


export class CreateLabStaffDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  lab:string

  @IsNotEmpty()
  identificationType:string

  @IsNotEmpty()
  birthday: string

  @IsNotEmpty()
  nationality:string

  @IsOptional()
  profilePicture:string

  @IsNotEmpty()
  entryDate:Date

  @IsOptional()
  bloodGroup:string
}
