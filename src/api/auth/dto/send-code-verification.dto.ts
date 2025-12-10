import { IsNotEmpty } from 'class-validator';

/* eslint-disable prettier/prettier */
export class SendCodeVerificationDto {
  @IsNotEmpty()
  phoneNumber: string;
}
