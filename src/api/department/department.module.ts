import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentSchema } from './schemas/department.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:"Department",schema:DepartmentSchema}])],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
