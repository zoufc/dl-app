import { Module } from '@nestjs/common';
import { SpecialityService } from './speciality.service';
import { SpecialityController } from './speciality.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialitySchema } from './schemas/speciality.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Speciality', schema: SpecialitySchema },
    ]),
  ],
  controllers: [SpecialityController],
  providers: [SpecialityService],
})
export class SpecialityModule {}
