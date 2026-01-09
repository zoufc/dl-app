import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateIntrantDto } from './dto/create-intrant.dto';
import { UpdateIntrantDto } from './dto/update-intrant.dto';
import { FindIntrantDto } from './dto/find-intrant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Intrant } from './interfaces/intrant.interface';
import logger from 'src/utils/logger';

@Injectable()
export class IntrantsService {
  constructor(
    @InjectModel('Intrant')
    private intrantModel: Model<Intrant>,
    @InjectModel('IntrantType')
    private intrantTypeModel: Model<any>,
  ) {}

  async create(createIntrantDto: CreateIntrantDto): Promise<Intrant> {
    try {
      logger.info(`---INTRANTS.SERVICE.CREATE INIT---`);
      const existing = await this.intrantModel.findOne({
        code: createIntrantDto.code,
      });
      if (existing) {
        throw new HttpException(
          'Un intrant avec ce code existe déjà',
          HttpStatus.CONFLICT,
        );
      }
      const intrant = await this.intrantModel.create(createIntrantDto);
      await intrant.populate({
        path: 'type',
        populate: { path: 'category' },
      });
      logger.info(`---INTRANTS.SERVICE.CREATE SUCCESS---`);
      return intrant;
    } catch (error) {
      logger.error(`---INTRANTS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: FindIntrantDto): Promise<any> {
    try {
      const { page = 1, limit = 10, search, type, category } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (type) filters.type = type;

      if (category) {
        const types = await this.intrantTypeModel
          .find({ category })
          .select('_id')
          .lean();
        filters.type = { $in: types.map((t) => t._id) };
      }

      if (search) {
        filters.$or = [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
        ];
      }

      const [data, total] = await Promise.all([
        this.intrantModel
          .find(filters)
          .populate({
            path: 'type',
            populate: { path: 'category' },
          })
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.intrantModel.countDocuments(filters).exec(),
      ]);

      return {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<Intrant> {
    try {
      const intrant = await this.intrantModel
        .findById(id)
        .populate({
          path: 'type',
          populate: { path: 'category' },
        })
        .exec();
      if (!intrant) {
        throw new HttpException('Intrant non trouvé', HttpStatus.NOT_FOUND);
      }
      return intrant;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateIntrantDto: UpdateIntrantDto,
  ): Promise<Intrant> {
    try {
      const updated = await this.intrantModel
        .findByIdAndUpdate(
          id,
          { ...updateIntrantDto, updated_at: new Date() },
          { new: true },
        )
        .populate({
          path: 'type',
          populate: { path: 'category' },
        })
        .exec();
      if (!updated) {
        throw new HttpException('Intrant non trouvé', HttpStatus.NOT_FOUND);
      }
      return updated;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<Intrant> {
    try {
      const deleted = await this.intrantModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Intrant non trouvé', HttpStatus.NOT_FOUND);
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
