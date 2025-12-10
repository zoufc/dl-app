import { IsNotEmpty } from 'class-validator';

/* eslint-disable prettier/prettier */
export class PhoneVerificationDto {
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  code: number;

  @IsNotEmpty()
  sentFor: string;
}
