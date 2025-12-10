import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier } from './entities/supplier.entity';
import logger from 'src/utils/logger';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel('Supplier') private supplierModel: Model<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    try {
      logger.info(`---SUPPLIERS.SERVICE.CREATE INIT---`);
      const supplier = await this.supplierModel.create(createSupplierDto);
      logger.info(`---SUPPLIERS.SERVICE.CREATE SUCCESS---`);
      return supplier;
    } catch (error) {
      logger.error(`---SUPPLIERS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      logger.info(`---SUPPLIERS.SERVICE.FIND_ALL INIT---`);
      const suppliers = await this.supplierModel.find().sort({ name: 1 }).exec();
      logger.info(`---SUPPLIERS.SERVICE.FIND_ALL SUCCESS---`);
      return suppliers;
    } catch (error) {
      logger.error(`---SUPPLIERS.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---SUPPLIERS.SERVICE.FIND_ONE INIT---`);
      const supplier = await this.supplierModel.findById(id).exec();
      if (!supplier) {
        throw new HttpException('Fournisseur non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---SUPPLIERS.SERVICE.FIND_ONE SUCCESS---`);
      return supplier;
    } catch (error) {
      logger.error(`---SUPPLIERS.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    try {
      logger.info(`---SUPPLIERS.SERVICE.UPDATE INIT---`);
      const updated = await this.supplierModel.findByIdAndUpdate(
        id,
        { ...updateSupplierDto, updated_at: new Date() },
        { new: true }
      ).exec();
      if (!updated) {
        throw new HttpException('Fournisseur non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---SUPPLIERS.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---SUPPLIERS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---SUPPLIERS.SERVICE.REMOVE INIT---`);
      const deleted = await this.supplierModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Fournisseur non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---SUPPLIERS.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---SUPPLIERS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
