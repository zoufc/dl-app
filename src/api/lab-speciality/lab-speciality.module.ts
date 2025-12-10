import { Module } from '@nestjs/common';
import { LabSpecialityService } from './lab-speciality.service';
import { LabSpecialityController } from './lab-speciality.controller';

@Module({
  controllers: [LabSpecialityController],
  providers: [LabSpecialityService],
})
export class LabSpecialityModule {}
