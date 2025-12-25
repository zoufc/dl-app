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
  Req,
} from '@nestjs/common';
import { PersonnalAssignmentService } from './personnal-assignment.service';
import { CreatePersonnalAssignmentDto } from './dto/create-personnal-assignment.dto';
import { UpdatePersonnalAssignmentDto } from './dto/update-personnal-assignment.dto';
import logger from 'src/utils/logger';

@Controller('personnal-assignments')
export class PersonnalAssignmentController {
  constructor(
    private readonly personnalAssignmentService: PersonnalAssignmentService,
  ) {}

  @Post()
  async create(
    @Body() createPersonnalAssignmentDto: CreatePersonnalAssignmentDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      logger.info(`---PERSONNAL_ASSIGNMENT.CONTROLLER.CREATE INIT---`);
      const requesterRole = req.user.role;
      const requesterLabId = req.user.lab?._id || req.user.lab || null;
      const assignment = await this.personnalAssignmentService.create(
        createPersonnalAssignmentDto,
        requesterRole,
        requesterLabId,
      );
      logger.info(`---PERSONNAL_ASSIGNMENT.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Affectation créée avec succès',
        data: assignment,
      });
    } catch (error) {
      logger.error(
        `---PERSONNAL_ASSIGNMENT.CONTROLLER.CREATE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Get()
  async findAll(
    @Query()
    query: {
      page?: number;
      limit?: number;
      user?: string;
      fromLab?: string;
      toLab?: string;
    },
    @Res() res,
  ) {
    try {
      logger.info(`---PERSONNAL_ASSIGNMENT.CONTROLLER.FIND_ALL INIT---`);
      const result = await this.personnalAssignmentService.findAll(query);
      logger.info(`---PERSONNAL_ASSIGNMENT.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des affectations',
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error(
        `---PERSONNAL_ASSIGNMENT.CONTROLLER.FIND_ALL ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(
        `---PERSONNAL_ASSIGNMENT.CONTROLLER.FIND_ONE INIT--- id=${id}`,
      );
      const assignment = await this.personnalAssignmentService.findOne(id);
      logger.info(
        `---PERSONNAL_ASSIGNMENT.CONTROLLER.FIND_ONE SUCCESS--- id=${id}`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Affectation récupérée avec succès',
        data: assignment,
      });
    } catch (error) {
      logger.error(
        `---PERSONNAL_ASSIGNMENT.CONTROLLER.FIND_ONE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePersonnalAssignmentDto: UpdatePersonnalAssignmentDto,
    @Res() res,
  ) {
    try {
      logger.info(`---PERSONNAL_ASSIGNMENT.CONTROLLER.UPDATE INIT--- id=${id}`);
      const updated = await this.personnalAssignmentService.update(
        id,
        updatePersonnalAssignmentDto,
      );
      logger.info(
        `---PERSONNAL_ASSIGNMENT.CONTROLLER.UPDATE SUCCESS--- id=${id}`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Affectation mise à jour avec succès',
        data: updated,
      });
    } catch (error) {
      logger.error(
        `---PERSONNAL_ASSIGNMENT.CONTROLLER.UPDATE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---PERSONNAL_ASSIGNMENT.CONTROLLER.REMOVE INIT--- id=${id}`);
      const deleted = await this.personnalAssignmentService.remove(id);
      logger.info(
        `---PERSONNAL_ASSIGNMENT.CONTROLLER.REMOVE SUCCESS--- id=${id}`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Affectation supprimée avec succès',
        data: deleted,
      });
    } catch (error) {
      logger.error(
        `---PERSONNAL_ASSIGNMENT.CONTROLLER.REMOVE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }
}
