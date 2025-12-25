import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessionalExperienceService } from './professional-experience.service';
import { ProfessionalExperienceController } from './professional-experience.controller';
import { ProfessionalExperienceSchema } from './schemas/professional-experience.schema';
import { TrainingModule } from '../training/training.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'ProfessionalExperience',
        schema: ProfessionalExperienceSchema,
      },
    ]),
    TrainingModule,
  ],
  controllers: [ProfessionalExperienceController],
  providers: [ProfessionalExperienceService],
  exports: [ProfessionalExperienceService],
})
export class ProfessionalExperienceModule {}
