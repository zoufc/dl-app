import { Module } from '@nestjs/common';
import { ServiceTypeService } from './service-type.service';
import { ServiceTypeController } from './service-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceTypeSchema } from './schemas/service-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ServiceType', schema: ServiceTypeSchema },
    ]),
  ],
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService],
})
export class ServiceTypeModule {}
