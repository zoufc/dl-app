import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IntrantType } from './interfaces/intrant-type.interface';
import { CreateIntrantTypeDto } from './dto/create-intrant-type.dto';
import { UpdateIntrantTypeDto } from './dto/update-intrant-type.dto';
import logger from 'src/utils/logger';

@Injectable()
export class IntrantTypesService {
  constructor(
    @InjectModel('IntrantType')
    private intrantTypeModel: Model<IntrantType>,
  ) {}

  async create(
    createIntrantTypeDto: CreateIntrantTypeDto,
  ): Promise<IntrantType> {
    try {
      logger.info(`---INTRANT_TYPES.SERVICE.CREATE INIT---`);
      const type = await this.intrantTypeModel.create(createIntrantTypeDto);
      await type.populate('category', 'name');
      logger.info(`---INTRANT_TYPES.SERVICE.CREATE SUCCESS---`);
      return type;
    } catch (error) {
      logger.error(`---INTRANT_TYPES.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: { category?: string }): Promise<IntrantType[]> {
    try {
      const filter: any = {};
      if (query.category) filter.category = query.category;
      return await this.intrantTypeModel
        .find(filter)
        .populate('category', 'name')
        .sort({ name: 1 })
        .exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<IntrantType> {
    try {
      const type = await this.intrantTypeModel
        .findById(id)
        .populate('category', 'name')
        .exec();
      if (!type) {
        throw new HttpException('Type non trouvé', HttpStatus.NOT_FOUND);
      }
      return type;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateIntrantTypeDto: UpdateIntrantTypeDto,
  ): Promise<IntrantType> {
    try {
      const updated = await this.intrantTypeModel
        .findByIdAndUpdate(
          id,
          { ...updateIntrantTypeDto, updated_at: new Date() },
          { new: true },
        )
        .populate('category', 'name')
        .exec();
      if (!updated) {
        throw new HttpException('Type non trouvé', HttpStatus.NOT_FOUND);
      }
      return updated;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<IntrantType> {
    try {
      const deleted = await this.intrantTypeModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Type non trouvé', HttpStatus.NOT_FOUND);
      }
      return deleted;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
