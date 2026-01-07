import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment } from './interfaces/equipment.interface';
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

      logger.info(`---EQUIPMENTS.SERVICE.CREATE SUCCESS---`);
      return equipment;
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message || "Erreur lors de la création de l'équipement",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    equipmentType?: string;
    search?: string;
  }): Promise<any> {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.FIND_ALL INIT---`);

      const { page = 1, limit = 10, equipmentType, search } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (equipmentType) filters.equipmentType = equipmentType;

      // Recherche globale
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        filters.$or = [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { notes: { $regex: searchRegex } },
        ];
      }

      const [data, total] = await Promise.all([
        this.equipmentModel
          .find(filters)
          .populate('equipmentType', 'name')
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.equipmentModel.countDocuments(filters),
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
      logger.error(`---EQUIPMENTS.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.FIND_ONE INIT--- id=${id}`);
      const equipment = await this.equipmentModel
        .findById(id)
        .populate('equipmentType', 'name')
        .lean();

      if (!equipment) {
        throw new HttpException('Équipement non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---EQUIPMENTS.SERVICE.FIND_ONE SUCCESS--- id=${id}`);
      return equipment;
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateEquipmentDto: UpdateEquipmentDto,
  ): Promise<any> {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.UPDATE INIT--- id=${id}`);

      const updateData: any = { ...updateEquipmentDto, updated_at: new Date() };

      const updated = await this.equipmentModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('equipmentType', 'name')
        .lean();

      if (!updated) {
        throw new HttpException('Équipement non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---EQUIPMENTS.SERVICE.UPDATE SUCCESS--- id=${id}`);
      return updated;
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.REMOVE INIT--- id=${id}`);
      const deleted = await this.equipmentModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Équipement non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---EQUIPMENTS.SERVICE.REMOVE SUCCESS--- id=${id}`);
      return deleted;
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
