import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase_order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase_order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PurchaseOrder } from './entities/purchase_order.entity';
import logger from 'src/utils/logger';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectModel('PurchaseOrder')
    private purchaseOrderModel: Model<PurchaseOrder>,
  ) {}

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto) {
    try {
      logger.info(`---PURCHASE_ORDERS.SERVICE.CREATE INIT---`);
      const purchaseOrder = await this.purchaseOrderModel.create(
        createPurchaseOrderDto,
      );
      await purchaseOrder.populate('supplier', 'name');
      logger.info(`---PURCHASE_ORDERS.SERVICE.CREATE SUCCESS---`);
      return purchaseOrder;
    } catch (error) {
      logger.error(`---PURCHASE_ORDERS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      logger.info(`---PURCHASE_ORDERS.SERVICE.FIND_ALL INIT---`);
      const purchaseOrders = await this.purchaseOrderModel
        .find()
        .populate('supplier', 'name')
        .sort({ created_at: -1 })
        .exec();
      logger.info(`---PURCHASE_ORDERS.SERVICE.FIND_ALL SUCCESS---`);
      return purchaseOrders;
    } catch (error) {
      logger.error(`---PURCHASE_ORDERS.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---PURCHASE_ORDERS.SERVICE.FIND_ONE INIT---`);
      const purchaseOrder = await this.purchaseOrderModel
        .findById(id)
        .populate('supplier', 'name')
        .exec();
      if (!purchaseOrder) {
        throw new HttpException('Commande non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---PURCHASE_ORDERS.SERVICE.FIND_ONE SUCCESS---`);
      return purchaseOrder;
    } catch (error) {
      logger.error(`---PURCHASE_ORDERS.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    try {
      logger.info(`---PURCHASE_ORDERS.SERVICE.UPDATE INIT---`);
      const updated = await this.purchaseOrderModel
        .findByIdAndUpdate(
          id,
          { ...updatePurchaseOrderDto, updated_at: new Date() },
          { new: true },
        )
        .populate('supplier', 'name')
        .exec();
      if (!updated) {
        throw new HttpException('Commande non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---PURCHASE_ORDERS.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---PURCHASE_ORDERS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---PURCHASE_ORDERS.SERVICE.REMOVE INIT---`);
      const deleted = await this.purchaseOrderModel
        .findByIdAndDelete(id)
        .exec();
      if (!deleted) {
        throw new HttpException('Commande non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---PURCHASE_ORDERS.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---PURCHASE_ORDERS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
