import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEquipmentTypeDto } from './dto/create-equipment_type.dto';
import { UpdateEquipmentTypeDto } from './dto/update-equipment_type.dto';
import { FindEquipmentTypeDto } from './dto/find-equipment_type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import logger from 'src/utils/logger';

@Injectable()
export class EquipmentTypesService {
  constructor(
    @InjectModel('EquipmentType') private equipmentTypeModel: Model<any>,
  ) {}

  async create(createEquipmentTypeDto: CreateEquipmentTypeDto) {
    try {
      logger.info(`---EQUIPMENT_TYPES.SERVICE.CREATE INIT---`);
      const equipmentType = await this.equipmentTypeModel.create(
        createEquipmentTypeDto,
      );
      logger.info(`---EQUIPMENT_TYPES.SERVICE.CREATE SUCCESS---`);
      return equipmentType;
    } catch (error) {
      logger.error(`---EQUIPMENT_TYPES.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: FindEquipmentTypeDto) {
    try {
      logger.info(`---EQUIPMENT_TYPES.SERVICE.FIND_ALL INIT---`);
      const { page = 1, limit = 10, search } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (search) {
        filters.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const [data, total] = await Promise.all([
        this.equipmentTypeModel
          .find(filters)
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.equipmentTypeModel.countDocuments(filters).exec(),
      ]);

      logger.info(`---EQUIPMENT_TYPES.SERVICE.FIND_ALL SUCCESS---`);
      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error(`---EQUIPMENT_TYPES.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---EQUIPMENT_TYPES.SERVICE.FIND_ONE INIT---`);
      const equipmentType = await this.equipmentTypeModel.findById(id).exec();
      if (!equipmentType) {
        throw new HttpException(
          "Type d'équipement non trouvé",
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---EQUIPMENT_TYPES.SERVICE.FIND_ONE SUCCESS---`);
      return equipmentType;
    } catch (error) {
      logger.error(`---EQUIPMENT_TYPES.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateEquipmentTypeDto: UpdateEquipmentTypeDto) {
    try {
      logger.info(`---EQUIPMENT_TYPES.SERVICE.UPDATE INIT---`);
      const updated = await this.equipmentTypeModel
        .findByIdAndUpdate(
          id,
          { ...updateEquipmentTypeDto, updated_at: new Date() },
          { new: true },
        )
        .exec();
      if (!updated) {
        throw new HttpException(
          "Type d'équipement non trouvé",
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---EQUIPMENT_TYPES.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---EQUIPMENT_TYPES.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---EQUIPMENT_TYPES.SERVICE.REMOVE INIT---`);
      const deleted = await this.equipmentTypeModel
        .findByIdAndDelete(id)
        .exec();
      if (!deleted) {
        throw new HttpException(
          "Type d'équipement non trouvé",
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---EQUIPMENT_TYPES.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---EQUIPMENT_TYPES.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
