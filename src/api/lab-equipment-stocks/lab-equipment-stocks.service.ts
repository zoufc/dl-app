import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LabEquipmentStock } from './interfaces/lab-equipment-stock.interface';
import { CreateLabEquipmentStockDto } from './dto/create-lab-equipment-stock.dto';
import { UpdateLabEquipmentStockDto } from './dto/update-lab-equipment-stock.dto';
import { FindLabEquipmentStockDto } from './dto/find-lab-equipment-stock.dto';
import logger from 'src/utils/logger';

@Injectable()
export class LabEquipmentStocksService {
  constructor(
    @InjectModel('LabEquipmentStock')
    private labEquipmentStockModel: Model<LabEquipmentStock>,
  ) {}

  async create(
    createLabEquipmentStockDto: CreateLabEquipmentStockDto,
  ): Promise<LabEquipmentStock> {
    try {
      logger.info(`---LAB_EQUIPMENT_STOCKS.SERVICE.CREATE INIT---`);
      const { lab, equipment } = createLabEquipmentStockDto;

      // Vérifier si un stock existe déjà pour ce lab et cet équipement
      const existingStock = await this.labEquipmentStockModel.findOne({
        lab,
        equipment,
      });
      if (existingStock) {
        throw new HttpException(
          'Un stock pour cet équipement existe déjà dans ce laboratoire',
          HttpStatus.CONFLICT,
        );
      }

      const stock = await this.labEquipmentStockModel.create(
        createLabEquipmentStockDto,
      );
      logger.info(`---LAB_EQUIPMENT_STOCKS.SERVICE.CREATE SUCCESS---`);
      return stock;
    } catch (error) {
      logger.error(`---LAB_EQUIPMENT_STOCKS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur lors de la création du stock',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: FindLabEquipmentStockDto): Promise<any> {
    try {
      logger.info(`---LAB_EQUIPMENT_STOCKS.SERVICE.FIND_ALL INIT---`);
      const { page = 1, limit = 10, lab, equipment } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (lab) filters.lab = lab;
      if (equipment) filters.equipment = equipment;

      const [data, total] = await Promise.all([
        this.labEquipmentStockModel
          .find(filters)
          .populate('lab', 'name')
          .populate({
            path: 'equipment',
            select: 'name equipmentType',
            populate: {
              path: 'equipmentType',
              select: 'name',
            },
          })
          .sort({ updated_at: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.labEquipmentStockModel.countDocuments(filters).exec(),
      ]);

      logger.info(`---LAB_EQUIPMENT_STOCKS.SERVICE.FIND_ALL SUCCESS---`);
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
      logger.error(
        `---LAB_EQUIPMENT_STOCKS.SERVICE.FIND_ALL ERROR ${error}---`,
      );
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<LabEquipmentStock> {
    try {
      logger.info(`---LAB_EQUIPMENT_STOCKS.SERVICE.FIND_ONE INIT--- id=${id}`);
      const stock = await this.labEquipmentStockModel
        .findById(id)
        .populate('lab', 'name')
        .populate({
          path: 'equipment',
          select: 'name equipmentType',
          populate: {
            path: 'equipmentType',
            select: 'name',
          },
        })
        .exec();

      if (!stock) {
        throw new HttpException('Stock non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(
        `---LAB_EQUIPMENT_STOCKS.SERVICE.FIND_ONE SUCCESS--- id=${id}`,
      );
      return stock;
    } catch (error) {
      logger.error(
        `---LAB_EQUIPMENT_STOCKS.SERVICE.FIND_ONE ERROR ${error}---`,
      );
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateLabEquipmentStockDto: UpdateLabEquipmentStockDto,
  ): Promise<LabEquipmentStock> {
    try {
      logger.info(`---LAB_EQUIPMENT_STOCKS.SERVICE.UPDATE INIT--- id=${id}`);
      // On utilise save() pour déclencher le hook pre-save si nécessaire
      const stock = await this.labEquipmentStockModel.findById(id);
      if (!stock) {
        throw new HttpException('Stock non trouvé', HttpStatus.NOT_FOUND);
      }

      Object.assign(stock, updateLabEquipmentStockDto);
      const updated = await stock.save();

      logger.info(`---LAB_EQUIPMENT_STOCKS.SERVICE.UPDATE SUCCESS--- id=${id}`);
      return updated;
    } catch (error) {
      logger.error(`---LAB_EQUIPMENT_STOCKS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<LabEquipmentStock> {
    try {
      logger.info(`---LAB_EQUIPMENT_STOCKS.SERVICE.REMOVE INIT--- id=${id}`);
      const deleted = await this.labEquipmentStockModel
        .findByIdAndDelete(id)
        .exec();
      if (!deleted) {
        throw new HttpException('Stock non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---LAB_EQUIPMENT_STOCKS.SERVICE.REMOVE SUCCESS--- id=${id}`);
      return deleted;
    } catch (error) {
      logger.error(`---LAB_EQUIPMENT_STOCKS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateQuantity(
    lab: string,
    equipment: string,
    quantity: number,
    unit: string,
  ): Promise<void> {
    try {
      if (!lab || !equipment) {
        logger.warn(
          `---LAB_EQUIPMENT_STOCKS.SERVICE.UPDATE_QUANTITY SKIP--- lab or equipment is missing`,
        );
        return;
      }
      const stock = await this.labEquipmentStockModel.findOne({
        lab,
        equipment,
      });
      if (stock) {
        stock.initialQuantity += quantity;
        await stock.save();
      } else {
        await this.labEquipmentStockModel.create({
          lab,
          equipment,
          initialQuantity: quantity,
          unit,
          minThreshold: 0,
        });
      }
    } catch (error) {
      logger.error(
        `---LAB_EQUIPMENT_STOCKS.SERVICE.UPDATE_QUANTITY ERROR ${error}---`,
      );
    }
  }
}
