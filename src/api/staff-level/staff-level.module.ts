import { Module } from '@nestjs/common';
import { StaffLevelService } from './staff-level.service';
import { StaffLevelController } from './staff-level.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffLevelSchema } from './schemas/staff-level.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'StaffLevel', schema: StaffLevelSchema },
    ]),
  ],
  controllers: [StaffLevelController],
  providers: [StaffLevelService],
  exports: [StaffLevelService],
})
export class StaffLevelModule {}
