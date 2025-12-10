/* eslint-disable prettier/prettier */
import { IsNotEmpty, isNotEmpty } from 'class-validator';

export class PhoneNumberAuthDto {
  @IsNotEmpty()
  phoneNumber: string;
}
