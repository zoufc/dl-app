import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { FindSupplierDto } from './dto/find-supplier.dto';
import { Roles } from 'src/utils/decorators/role.decorator';
import { Role } from 'src/utils/enums/roles.enum';
import logger from 'src/utils/logger';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Roles(Role.SuperAdmin, Role.LabAdmin)
  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto, @Res() res) {
    try {
      logger.info(`---SUPPLIERS.CONTROLLER.CREATE INIT---`);
      const supplier = await this.suppliersService.create(createSupplierDto);
      logger.info(`---SUPPLIERS.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Fournisseur créé avec succès',
        data: supplier,
      });
    } catch (error) {
      logger.error(`---SUPPLIERS.CONTROLLER.CREATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Roles(Role.SuperAdmin, Role.LabAdmin, Role.LabStaff)
  @Get()
  async findAll(@Query() query: FindSupplierDto, @Res() res) {
    try {
      logger.info(`---SUPPLIERS.CONTROLLER.FIND_ALL INIT---`);
      const result = await this.suppliersService.findAll(query);
      logger.info(`---SUPPLIERS.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des fournisseurs',
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error(`---SUPPLIERS.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Roles(Role.SuperAdmin, Role.LabAdmin, Role.LabStaff)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---SUPPLIERS.CONTROLLER.FIND_ONE INIT--- id=${id}`);
      const supplier = await this.suppliersService.findOne(id);
      logger.info(`---SUPPLIERS.CONTROLLER.FIND_ONE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Fournisseur récupéré avec succès',
        data: supplier,
      });
    } catch (error) {
      logger.error(`---SUPPLIERS.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Roles(Role.SuperAdmin, Role.LabAdmin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Res() res,
  ) {
    try {
      logger.info(`---SUPPLIERS.CONTROLLER.UPDATE INIT--- id=${id}`);
      const updated = await this.suppliersService.update(id, updateSupplierDto);
      logger.info(`---SUPPLIERS.CONTROLLER.UPDATE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Fournisseur mis à jour avec succès',
        data: updated,
      });
    } catch (error) {
      logger.error(`---SUPPLIERS.CONTROLLER.UPDATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Roles(Role.SuperAdmin)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---SUPPLIERS.CONTROLLER.REMOVE INIT--- id=${id}`);
      const deleted = await this.suppliersService.remove(id);
      logger.info(`---SUPPLIERS.CONTROLLER.REMOVE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Fournisseur supprimé avec succès',
        data: deleted,
      });
    } catch (error) {
      logger.error(`---SUPPLIERS.CONTROLLER.REMOVE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }
}
