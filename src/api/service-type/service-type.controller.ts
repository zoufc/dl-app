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
import { ServiceTypeService } from './service-type.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import logger from 'src/utils/logger';

@Controller('service-type')
export class ServiceTypeController {
  constructor(private readonly serviceTypeService: ServiceTypeService) {}

  @Post('create')
  async create(@Body() createServiceTypeDto: CreateServiceTypeDto, @Res() res) {
    try {
      const serviceType = await this.serviceTypeService.create(
        createServiceTypeDto,
      );
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Service type créé', data: serviceType });
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }

  @Get('findAll')
  async findAll(@Res() res) {
    try {
      const serviceTypes = await this.serviceTypeService.findAll();
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Liste des service types', data: serviceTypes });
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---SERVICE_TYPE.CONTROLLER.FIND_ONE INIT---`);
      const serviceType = await this.serviceTypeService.findOne(id);
      logger.info(`---SERVICE_TYPE.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Type de service ${id}`,
        data: serviceType
      });
    } catch (error) {
      logger.error(`---SERVICE_TYPE.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceTypeDto: UpdateServiceTypeDto,
    @Res() res,
  ) {
    try {
      logger.info(`---SERVICE_TYPE.CONTROLLER.UPDATE INIT---`);
      const updated = await this.serviceTypeService.update(id, updateServiceTypeDto);
      logger.info(`---SERVICE_TYPE.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Type de service ${id} mis à jour`,
        data: updated
      });
    } catch (error) {
      logger.error(`---SERVICE_TYPE.CONTROLLER.UPDATE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---SERVICE_TYPE.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.serviceTypeService.remove(id);
      logger.info(`---SERVICE_TYPE.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Type de service ${id} supprimé`,
        data: deleted
      });
    } catch (error) {
      logger.error(`---SERVICE_TYPE.CONTROLLER.REMOVE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
