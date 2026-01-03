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
  Query,
} from '@nestjs/common';
import { SdrService } from './sdr.service';
import { CreateSdrDto } from './dto/create-sdr.dto';
import { UpdateSdrDto } from './dto/update-sdr.dto';
import { FindSdrDto } from './dto/find-sdr.dto';
import logger from 'src/utils/logger';
import { Roles } from 'src/utils/decorators/role.decorator';
import { Role } from 'src/utils/enums/roles.enum';

@Controller('sdr')
export class SdrController {
  constructor(private readonly sdrService: SdrService) {}

  @Roles(Role.SuperAdmin)
  @Post()
  async create(@Body() createSdrDto: CreateSdrDto, @Res() res) {
    try {
      logger.info(`---SDR.CONTROLLER.CREATE INIT---`);
      const sdr = await this.sdrService.create(createSdrDto);
      logger.info(`---SDR.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'SDR créée avec succès',
        data: sdr,
      });
    } catch (error) {
      logger.error(`---SDR.CONTROLLER.CREATE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Erreur lors de la création de la SDR',
      });
    }
  }

  @Roles(Role.SuperAdmin, Role.SdrAdmin)
  @Get()
  async findAll(@Query() query: FindSdrDto, @Res() res) {
    try {
      logger.info(`---SDR.CONTROLLER.FIND_ALL INIT---`);
      const result = await this.sdrService.findAll(query);
      logger.info(`---SDR.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des SDR',
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error(`---SDR.CONTROLLER.FIND_ALL ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Erreur lors de la récupération des SDR',
      });
    }
  }

  @Roles(Role.SuperAdmin, Role.SdrAdmin)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---SDR.CONTROLLER.FIND_ONE INIT--- id=${id}`);
      const sdr = await this.sdrService.findOne(id);
      logger.info(`---SDR.CONTROLLER.FIND_ONE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'SDR trouvée',
        data: sdr,
      });
    } catch (error) {
      logger.error(`---SDR.CONTROLLER.FIND_ONE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Erreur lors de la récupération de la SDR',
      });
    }
  }

  @Roles(Role.SuperAdmin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSdrDto: UpdateSdrDto,
    @Res() res,
  ) {
    try {
      logger.info(`---SDR.CONTROLLER.UPDATE INIT--- id=${id}`);
      const updated = await this.sdrService.update(id, updateSdrDto);
      logger.info(`---SDR.CONTROLLER.UPDATE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'SDR mise à jour avec succès',
        data: updated,
      });
    } catch (error) {
      logger.error(`---SDR.CONTROLLER.UPDATE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Erreur lors de la mise à jour de la SDR',
      });
    }
  }

  @Roles(Role.SuperAdmin)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---SDR.CONTROLLER.REMOVE INIT--- id=${id}`);
      const deleted = await this.sdrService.remove(id);
      logger.info(`---SDR.CONTROLLER.REMOVE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'SDR supprimée avec succès',
        data: deleted,
      });
    } catch (error) {
      logger.error(`---SDR.CONTROLLER.REMOVE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Erreur lors de la suppression de la SDR',
      });
    }
  }
}
