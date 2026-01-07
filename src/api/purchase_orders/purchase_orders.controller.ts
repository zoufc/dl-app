import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PurchaseOrdersService } from './purchase_orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase_order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase_order.dto';
import logger from 'src/utils/logger';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  async create(
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
    @Res() res,
  ) {
    try {
      logger.info(`---PURCHASE_ORDERS.CONTROLLER.CREATE INIT---`);
      const purchaseOrder = await this.purchaseOrdersService.create(
        createPurchaseOrderDto,
      );
      logger.info(`---PURCHASE_ORDERS.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Commande créée avec succès',
        data: purchaseOrder,
      });
    } catch (error) {
      logger.error(`---PURCHASE_ORDERS.CONTROLLER.CREATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      logger.info(`---PURCHASE_ORDERS.CONTROLLER.FIND_ALL INIT---`);
      const purchaseOrders = await this.purchaseOrdersService.findAll();
      logger.info(`---PURCHASE_ORDERS.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des commandes',
        data: purchaseOrders,
      });
    } catch (error) {
      logger.error(`---PURCHASE_ORDERS.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---PURCHASE_ORDERS.CONTROLLER.FIND_ONE INIT---`);
      const purchaseOrder = await this.purchaseOrdersService.findOne(id);
      logger.info(`---PURCHASE_ORDERS.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Commande ${id}`,
        data: purchaseOrder,
      });
    } catch (error) {
      logger.error(`---PURCHASE_ORDERS.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,
    @Res() res,
  ) {
    try {
      logger.info(`---PURCHASE_ORDERS.CONTROLLER.UPDATE INIT---`);
      const updated = await this.purchaseOrdersService.update(
        id,
        updatePurchaseOrderDto,
      );
      logger.info(`---PURCHASE_ORDERS.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Commande ${id} mise à jour`,
        data: updated,
      });
    } catch (error) {
      logger.error(`---PURCHASE_ORDERS.CONTROLLER.UPDATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---PURCHASE_ORDERS.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.purchaseOrdersService.remove(id);
      logger.info(`---PURCHASE_ORDERS.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Commande ${id} supprimée`,
        data: deleted,
      });
    } catch (error) {
      logger.error(`---PURCHASE_ORDERS.CONTROLLER.REMOVE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
