import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment } from './entities/equipment.entity';
import logger from 'src/utils/logger';

@Injectable()
export class EquipmentsService {
  constructor(
    @InjectModel('Equipment') private equipmentModel: Model<Equipment>,
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto) {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.CREATE INIT---`);
      const equipment = await this.equipmentModel.create(createEquipmentDto);
      await equipment.populate('equipmentType', 'name');
      await equipment.populate('location', 'name');
      logger.info(`---EQUIPMENTS.SERVICE.CREATE SUCCESS---`);
      return equipment;
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.FIND_ALL INIT---`);
      const equipments = await this.equipmentModel.find()
        .populate('equipmentType', 'name')
        .populate('location', 'name')
        .sort({ created_at: -1 })
        .exec();
      logger.info(`---EQUIPMENTS.SERVICE.FIND_ALL SUCCESS---`);
      return equipments;
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.FIND_ONE INIT---`);
      const equipment = await this.equipmentModel.findById(id)
        .populate('equipmentType', 'name')
        .populate('location', 'name')
        .exec();
      if (!equipment) {
        throw new HttpException('Équipement non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---EQUIPMENTS.SERVICE.FIND_ONE SUCCESS---`);
      return equipment;
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateEquipmentDto: UpdateEquipmentDto) {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.UPDATE INIT---`);
      const updated = await this.equipmentModel.findByIdAndUpdate(
        id,
        { ...updateEquipmentDto, updated_at: new Date() },
        { new: true }
      )
      .populate('equipmentType', 'name')
      .populate('location', 'name')
      .exec();
      if (!updated) {
        throw new HttpException('Équipement non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---EQUIPMENTS.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.REMOVE INIT---`);
      const deleted = await this.equipmentModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Équipement non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---EQUIPMENTS.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
