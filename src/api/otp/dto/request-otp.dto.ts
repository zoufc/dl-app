import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { OtpTypeEnum } from '../schemas/otp.schema';

export class RequestOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(OtpTypeEnum)
  type: OtpTypeEnum;
}
