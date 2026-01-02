/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { ProfessionalExperienceSchema } from '../professional-experience/schemas/professional-experience.schema';
import { TrainingSchema } from '../training/schemas/training.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'ProfessionalExperience', schema: ProfessionalExperienceSchema },
      { name: 'Training', schema: TrainingSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
