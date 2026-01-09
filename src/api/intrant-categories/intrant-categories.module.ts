import { Module } from '@nestjs/common';
import { IntrantCategoriesService } from './intrant-categories.service';
import { IntrantCategoriesController } from './intrant-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IntrantCategorySchema } from './schemas/intrant-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'IntrantCategory', schema: IntrantCategorySchema },
    ]),
  ],
  controllers: [IntrantCategoriesController],
  providers: [IntrantCategoriesService],
  exports: [IntrantCategoriesService],
})
export class IntrantCategoriesModule {}
