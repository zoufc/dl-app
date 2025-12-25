import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  region: string;
}
