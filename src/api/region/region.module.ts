import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionSchema } from './schemas/region.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:"Region",schema:RegionSchema}])],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}
