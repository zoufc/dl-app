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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TrainingService } from './training.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import logger from 'src/utils/logger';
import { UploadHelper } from 'src/utils/functions/upload-image.helper';

@Controller('trainings')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({ destination: UploadHelper.uploadDirectory }),
    }),
  )
  @Post()
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createTrainingDto: CreateTrainingDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      logger.info(`---TRAINING.CONTROLLER.CREATE INIT---`);
      const requesterId = req.user._id || req.user.userId || req.user.id;
      const requesterRole = req.user.role;
      const training = await this.trainingService.create(
        createTrainingDto,
        requesterId,
        requesterRole,
        files || [],
      );
      logger.info(`---TRAINING.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Formation créée avec succès',
        data: training,
      });
    } catch (error) {
      logger.error(`---TRAINING.CONTROLLER.CREATE ERROR--- ${error.message}`);
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
      type?: string;
      country?: string;
    },
    @Res() res,
  ) {
    try {
      logger.info(`---TRAINING.CONTROLLER.FIND_ALL INIT---`);
      const result = await this.trainingService.findAll(query);
      logger.info(`---TRAINING.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des formations',
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error(`---TRAINING.CONTROLLER.FIND_ALL ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---TRAINING.CONTROLLER.FIND_ONE INIT--- id=${id}`);
      const training = await this.trainingService.findOne(id);
      logger.info(`---TRAINING.CONTROLLER.FIND_ONE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Formation récupérée avec succès',
        data: training,
      });
    } catch (error) {
      logger.error(`---TRAINING.CONTROLLER.FIND_ONE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({ destination: UploadHelper.uploadDirectory }),
    }),
  )
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateTrainingDto: UpdateTrainingDto,
    @Res() res,
  ) {
    try {
      logger.info(`---TRAINING.CONTROLLER.UPDATE INIT--- id=${id}`);
      const updated = await this.trainingService.update(
        id,
        updateTrainingDto,
        files || [],
      );
      logger.info(`---TRAINING.CONTROLLER.UPDATE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Formation mise à jour avec succès',
        data: updated,
      });
    } catch (error) {
      logger.error(`---TRAINING.CONTROLLER.UPDATE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---TRAINING.CONTROLLER.REMOVE INIT--- id=${id}`);
      const deleted = await this.trainingService.remove(id);
      logger.info(`---TRAINING.CONTROLLER.REMOVE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Formation supprimée avec succès',
        data: deleted,
      });
    } catch (error) {
      logger.error(`---TRAINING.CONTROLLER.REMOVE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }
}
