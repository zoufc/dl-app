import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonnalAssignmentService } from './personnal-assignment.service';
import { PersonnalAssignmentController } from './personnal-assignment.controller';
import { PersonnalAssignmentSchema } from './schemas/personnal-assignment.schema';
import { UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PersonnalAssignment', schema: PersonnalAssignmentSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [PersonnalAssignmentController],
  providers: [PersonnalAssignmentService],
  exports: [PersonnalAssignmentService],
})
export class PersonnalAssignmentModule {}
