import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { RequestTypeEnum } from 'src/utils/enums/request-type.enum';
import { RequestStatusEnum } from 'src/utils/enums/request-status.enum';

export class FindRequestsDto {
  @IsOptional()
  @IsEnum(RequestTypeEnum)
  type?: RequestTypeEnum;

  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: RequestStatusEnum;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
