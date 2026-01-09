import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IntrantStock } from './interfaces/intrant-stock.interface';
import { CreateIntrantStockDto } from './dto/create-intrant-stock.dto';
import { UpdateIntrantStockDto } from './dto/update-intrant-stock.dto';
import { FindIntrantStockDto } from './dto/find-intrant-stock.dto';
import logger from 'src/utils/logger';

@Injectable()
export class IntrantStocksService {
  constructor(
    @InjectModel('IntrantStock')
    private intrantStockModel: Model<IntrantStock>,
  ) {}

  async create(
    createIntrantStockDto: CreateIntrantStockDto,
  ): Promise<IntrantStock> {
    try {
      const { lab, intrant } = createIntrantStockDto;
      const existing = await this.intrantStockModel.findOne({ lab, intrant });
      if (existing) {
        throw new HttpException(
          'Un stock pour cet intrant existe déjà dans ce laboratoire',
          HttpStatus.CONFLICT,
        );
      }
      return await this.intrantStockModel.create(createIntrantStockDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateQuantity(
    lab: string,
    intrant: string,
    quantity: number,
    unit: string,
  ): Promise<void> {
    try {
      const stock = await this.intrantStockModel.findOne({ lab, intrant });
      if (stock) {
        stock.initialQuantity += quantity;
        await stock.save();
      } else {
        await this.intrantStockModel.create({
          lab,
          intrant,
          initialQuantity: quantity,
          unit,
        });
      }
    } catch (error) {
      logger.error(
        `---INTRANT_STOCKS.SERVICE.UPDATE_QUANTITY ERROR ${error}---`,
      );
    }
  }

  async findAll(query: FindIntrantStockDto): Promise<any> {
    try {
      const { lab, intrant } = query;
      const filters: any = {};
      if (lab) filters.lab = lab;
      if (intrant) filters.intrant = intrant;

      const data = await this.intrantStockModel
        .find(filters)
        .populate('lab', 'name')
        .populate('intrant', 'name code unit')
        .sort({ updated_at: -1 })
        .exec();

      return { data };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<IntrantStock> {
    try {
      const stock = await this.intrantStockModel
        .findById(id)
        .populate('lab', 'name')
        .populate('intrant', 'name code unit')
        .exec();
      if (!stock)
        throw new HttpException('Stock non trouvé', HttpStatus.NOT_FOUND);
      return stock;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateIntrantStockDto: UpdateIntrantStockDto,
  ): Promise<IntrantStock> {
    try {
      const updated = await this.intrantStockModel
        .findByIdAndUpdate(
          id,
          { ...updateIntrantStockDto, updated_at: new Date() },
          { new: true },
        )
        .exec();
      if (!updated)
        throw new HttpException('Stock non trouvé', HttpStatus.NOT_FOUND);
      return updated;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<IntrantStock> {
    try {
      const deleted = await this.intrantStockModel.findByIdAndDelete(id).exec();
      if (!deleted)
        throw new HttpException('Stock non trouvé', HttpStatus.NOT_FOUND);
      return deleted;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
