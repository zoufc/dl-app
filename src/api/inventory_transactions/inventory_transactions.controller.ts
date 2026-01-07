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
import { InventoryTransactionsService } from './inventory_transactions.service';
import { CreateInventoryTransactionDto } from './dto/create-inventory_transaction.dto';
import { UpdateInventoryTransactionDto } from './dto/update-inventory_transaction.dto';
import logger from 'src/utils/logger';

@Controller('inventory-transactions')
export class InventoryTransactionsController {
  constructor(
    private readonly inventoryTransactionsService: InventoryTransactionsService,
  ) {}

  @Post()
  async create(
    @Body() createInventoryTransactionDto: CreateInventoryTransactionDto,
    @Res() res,
  ) {
    try {
      logger.info(`---INVENTORY_TRANSACTIONS.CONTROLLER.CREATE INIT---`);
      const inventoryTransaction =
        await this.inventoryTransactionsService.create(
          createInventoryTransactionDto,
        );
      logger.info(`---INVENTORY_TRANSACTIONS.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: "Transaction d'inventaire créée avec succès",
        data: inventoryTransaction,
      });
    } catch (error) {
      logger.error(
        `---INVENTORY_TRANSACTIONS.CONTROLLER.CREATE ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      logger.info(`---INVENTORY_TRANSACTIONS.CONTROLLER.FIND_ALL INIT---`);
      const inventoryTransactions =
        await this.inventoryTransactionsService.findAll();
      logger.info(`---INVENTORY_TRANSACTIONS.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: "Liste des transactions d'inventaire",
        data: inventoryTransactions,
      });
    } catch (error) {
      logger.error(
        `---INVENTORY_TRANSACTIONS.CONTROLLER.FIND_ALL ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---INVENTORY_TRANSACTIONS.CONTROLLER.FIND_ONE INIT---`);
      const inventoryTransaction =
        await this.inventoryTransactionsService.findOne(id);
      logger.info(`---INVENTORY_TRANSACTIONS.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Transaction d'inventaire ${id}`,
        data: inventoryTransaction,
      });
    } catch (error) {
      logger.error(
        `---INVENTORY_TRANSACTIONS.CONTROLLER.FIND_ONE ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInventoryTransactionDto: UpdateInventoryTransactionDto,
    @Res() res,
  ) {
    try {
      logger.info(`---INVENTORY_TRANSACTIONS.CONTROLLER.UPDATE INIT---`);
      const updated = await this.inventoryTransactionsService.update(
        id,
        updateInventoryTransactionDto,
      );
      logger.info(`---INVENTORY_TRANSACTIONS.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Transaction d'inventaire ${id} mise à jour`,
        data: updated,
      });
    } catch (error) {
      logger.error(
        `---INVENTORY_TRANSACTIONS.CONTROLLER.UPDATE ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---INVENTORY_TRANSACTIONS.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.inventoryTransactionsService.remove(id);
      logger.info(`---INVENTORY_TRANSACTIONS.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Transaction d'inventaire ${id} supprimée`,
        data: deleted,
      });
    } catch (error) {
      logger.error(
        `---INVENTORY_TRANSACTIONS.CONTROLLER.REMOVE ERROR ${error}---`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
