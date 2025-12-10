/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ServiceProviderService } from './service-provider.service';
import { ServiceProviderController } from './service-provider.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceProviderSchema } from './schemas/service-provider.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ServiceProvider', schema: ServiceProviderSchema },
    ]),
  ],
  controllers: [ServiceProviderController],
  providers: [ServiceProviderService],
})
export class ServiceProviderModule {}
