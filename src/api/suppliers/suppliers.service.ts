import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier } from './interfaces/supplier.interface';
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
      if (error.code === 11000) {
        throw new HttpException(
          'Un fournisseur avec ce nom existe déjà',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        error.message || 'Erreur lors de la création du fournisseur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<any> {
    try {
      logger.info(`---SUPPLIERS.SERVICE.FIND_ALL INIT---`);

      const { page = 1, limit = 10, status, search } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (status) filters.status = status;

      // Recherche globale
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        filters.$or = [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { contactPerson: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { phoneNumber: { $regex: searchRegex } },
          { address: { $regex: searchRegex } },
          { city: { $regex: searchRegex } },
          { country: { $regex: searchRegex } },
        ];
      }

      const [data, total] = await Promise.all([
        this.supplierModel
          .find(filters)
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.supplierModel.countDocuments(filters),
      ]);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error(`---SUPPLIERS.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      logger.info(`---SUPPLIERS.SERVICE.FIND_ONE INIT--- id=${id}`);
      const supplier = await this.supplierModel.findById(id).lean();
      if (!supplier) {
        throw new HttpException('Fournisseur non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---SUPPLIERS.SERVICE.FIND_ONE SUCCESS--- id=${id}`);
      return supplier;
    } catch (error) {
      logger.error(`---SUPPLIERS.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<any> {
    try {
      logger.info(`---SUPPLIERS.SERVICE.UPDATE INIT--- id=${id}`);
      const updated = await this.supplierModel
        .findByIdAndUpdate(
          id,
          { ...updateSupplierDto, updated_at: new Date() },
          { new: true },
        )
        .lean();
      if (!updated) {
        throw new HttpException('Fournisseur non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---SUPPLIERS.SERVICE.UPDATE SUCCESS--- id=${id}`);
      return updated;
    } catch (error) {
      logger.error(`---SUPPLIERS.SERVICE.UPDATE ERROR ${error}---`);
      if (error.code === 11000) {
        throw new HttpException(
          'Un fournisseur avec ce nom existe déjà',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---SUPPLIERS.SERVICE.REMOVE INIT--- id=${id}`);
      const deleted = await this.supplierModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Fournisseur non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---SUPPLIERS.SERVICE.REMOVE SUCCESS--- id=${id}`);
      return deleted;
    } catch (error) {
      logger.error(`---SUPPLIERS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
