import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EquipmentOrder } from './interfaces/equipment-order.interface';
import { CreateEquipmentOrderDto } from './dto/create-equipment-order.dto';
import { FindEquipmentOrderDto } from './dto/find-equipment-order.dto';
import logger from 'src/utils/logger';
import { UpdateEquipmentOrderDto } from './dto/update-equipment-order.dto';
import { OrderStatusEnum } from './schemas/equipment-order.schema';
import { LabEquipmentStocksService } from '../lab-equipment-stocks/lab-equipment-stocks.service';

@Injectable()
export class EquipmentOrdersService {
  constructor(
    @InjectModel('EquipmentOrder')
    private equipmentOrderModel: Model<EquipmentOrder>,
    @InjectModel('Equipment') private equipmentModel: Model<any>,
    private labEquipmentStocksService: LabEquipmentStocksService,
  ) {}

  async create(
    createEquipmentOrderDto: CreateEquipmentOrderDto,
  ): Promise<EquipmentOrder> {
    try {
      logger.info(`---EQUIPMENT_ORDERS.SERVICE.CREATE INIT---`);
      const order = await this.equipmentOrderModel.create(
        createEquipmentOrderDto,
      );

      // Si le statut est COMPLETED à la création, on met à jour le stock
      if (order.status === OrderStatusEnum.COMPLETED && order.lab) {
        await this.labEquipmentStocksService.updateQuantity(
          order.lab.toString(),
          order.equipment.toString(),
          order.quantity,
          order.unit,
        );
      }

      await order.populate('lab', 'name');
      await order.populate('supplier', 'name');
      await order.populate('equipment', 'name');
      await order.populate(
        'validatedBy',
        'firstname lastname phoneNumber email',
      );
      await order.populate(
        'completedBy',
        'firstname lastname phoneNumber email',
      );
      logger.info(`---EQUIPMENT_ORDERS.SERVICE.CREATE SUCCESS---`);
      return order;
    } catch (error) {
      logger.error(`---EQUIPMENT_ORDERS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur lors de la création de la commande',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: FindEquipmentOrderDto): Promise<any> {
    try {
      logger.info(`---EQUIPMENT_ORDERS.SERVICE.FIND_ALL INIT---`);
      const {
        page = 1,
        limit = 10,
        search,
        supplier,
        equipment,
        lab,
        status,
        validatedBy,
        completedBy,
      } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (supplier) filters.supplier = supplier;
      if (equipment) filters.equipment = equipment;
      if (lab) filters.lab = lab;
      if (status) filters.status = status;
      if (validatedBy) filters.validatedBy = validatedBy;
      if (completedBy) filters.completedBy = completedBy;

      if (search) {
        filters.$or = [{ notes: { $regex: search, $options: 'i' } }];
      }

      const [data, total] = await Promise.all([
        this.equipmentOrderModel
          .find(filters)
          .populate('lab', 'name')
          .populate('supplier', 'name email phoneNumber')
          .populate('equipment', 'name')
          .populate('validatedBy', 'firstname lastname phoneNumber email')
          .populate('completedBy', 'firstname lastname phoneNumber email')
          .sort({ purchaseDate: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.equipmentOrderModel.countDocuments(filters).exec(),
      ]);

      logger.info(`---EQUIPMENT_ORDERS.SERVICE.FIND_ALL SUCCESS---`);
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
      logger.error(`---EQUIPMENT_ORDERS.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      logger.info(`---EQUIPMENT_ORDERS.SERVICE.FIND_ONE INIT--- id=${id}`);
      const order = await this.equipmentOrderModel
        .findById(id)
        .populate('lab', 'name')
        .populate('supplier', 'name email phoneNumber address')
        .populate('equipment', 'name')
        .populate('validatedBy', 'firstname lastname phoneNumber email')
        .populate('completedBy', 'firstname lastname phoneNumber email')
        .lean();

      if (!order) {
        throw new HttpException('Commande non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---EQUIPMENT_ORDERS.SERVICE.FIND_ONE SUCCESS--- id=${id}`);
      return order;
    } catch (error) {
      logger.error(`---EQUIPMENT_ORDERS.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateEquipmentOrderDto: UpdateEquipmentOrderDto,
  ): Promise<any> {
    try {
      logger.info(`---EQUIPMENT_ORDERS.SERVICE.UPDATE INIT--- id=${id}`);

      // Récupérer la commande actuelle pour comparer le statut
      const currentOrder = await this.equipmentOrderModel
        .findById(id)
        .populate('equipment');
      if (!currentOrder) {
        throw new HttpException('Commande non trouvée', HttpStatus.NOT_FOUND);
      }

      const oldStatus = currentOrder.status;
      const newStatus = updateEquipmentOrderDto.status;

      const updated = await this.equipmentOrderModel
        .findByIdAndUpdate(
          id,
          { ...updateEquipmentOrderDto, updated_at: new Date() },
          { new: true },
        )
        .populate('lab', 'name')
        .populate('supplier', 'name')
        .populate('equipment', 'name')
        .populate('validatedBy', 'firstname lastname phoneNumber email')
        .populate('completedBy', 'firstname lastname phoneNumber email')
        .lean();

      // Si le statut passe à COMPLETED, on augmente le stock du labo
      if (
        newStatus === OrderStatusEnum.COMPLETED &&
        oldStatus !== OrderStatusEnum.COMPLETED
      ) {
        logger.info(
          `---EQUIPMENT_ORDERS.SERVICE.UPDATE STATUS COMPLETED--- updating stock quantity`,
        );

        // currentOrder.equipment est déjà peuplé car on a fait .populate('equipment') plus haut
        const equipment = currentOrder.equipment;
        console.log('---EQUIPMENT---', equipment);

        if (equipment && equipment.equipmentType && currentOrder.lab) {
          await this.labEquipmentStocksService.updateQuantity(
            currentOrder.lab.toString(),
            equipment._id.toString(),
            currentOrder.quantity,
            currentOrder.unit,
          );
        }
      }
      // Si le statut était COMPLETED et qu'il change vers autre chose
      else if (
        oldStatus === OrderStatusEnum.COMPLETED &&
        newStatus !== OrderStatusEnum.COMPLETED &&
        newStatus !== undefined
      ) {
        logger.info(
          `---EQUIPMENT_ORDERS.SERVICE.UPDATE STATUS FROM COMPLETED--- updating stock quantity`,
        );
        const equipment = currentOrder.equipment;
        if (equipment && equipment.equipmentType && currentOrder.lab) {
          await this.labEquipmentStocksService.updateQuantity(
            currentOrder.lab.toString(),
            equipment._id.toString(),
            -currentOrder.quantity,
            currentOrder.unit,
          );
        }
      }

      logger.info(`---EQUIPMENT_ORDERS.SERVICE.UPDATE SUCCESS--- id=${id}`);
      return updated;
    } catch (error) {
      logger.error(`---EQUIPMENT_ORDERS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<EquipmentOrder> {
    try {
      logger.info(`---EQUIPMENT_ORDERS.SERVICE.REMOVE INIT--- id=${id}`);
      const order = await this.equipmentOrderModel.findById(id);
      if (!order) {
        throw new HttpException('Commande non trouvée', HttpStatus.NOT_FOUND);
      }

      const deleted = await this.equipmentOrderModel
        .findByIdAndDelete(id)
        .exec();

      // Si la commande était COMPLETED, on décrémente le stock du labo
      if (order.status === OrderStatusEnum.COMPLETED && order.lab) {
        await this.labEquipmentStocksService.updateQuantity(
          order.lab.toString(),
          order.equipment.toString(),
          -order.quantity,
          order.unit,
        );
      }

      logger.info(`---EQUIPMENT_ORDERS.SERVICE.REMOVE SUCCESS--- id=${id}`);
      return deleted as unknown as EquipmentOrder;
    } catch (error) {
      logger.error(`---EQUIPMENT_ORDERS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
