import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { RequestCommentService } from './request-comment.service';
import { CreateRequestCommentDto } from './dto/create-request-comment.dto';
import { UpdateRequestCommentDto } from './dto/update-request-comment.dto';
import { FindRequestCommentDto } from './dto/find-request-comment.dto';
import { Roles } from 'src/utils/decorators/role.decorator';
import { Role } from 'src/utils/enums/roles.enum';
import logger from 'src/utils/logger';

@Controller('request-comments')
export class RequestCommentController {
  constructor(private readonly requestCommentService: RequestCommentService) {}

  @Post()
  @Roles(Role.SuperAdmin, Role.RegionAdmin, Role.LabAdmin)
  async create(
    @Body() createRequestCommentDto: CreateRequestCommentDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      logger.info(`---REQUEST_COMMENT.CONTROLLER.CREATE INIT---`);
      const authorId = req.user._id || req.user.userId || req.user.id;
      const comment = await this.requestCommentService.create(
        createRequestCommentDto,
        authorId,
      );
      logger.info(`---REQUEST_COMMENT.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Commentaire créé avec succès',
        data: comment,
      });
    } catch (error) {
      logger.error(
        `---REQUEST_COMMENT.CONTROLLER.CREATE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async findAll(@Query() query: FindRequestCommentDto, @Res() res) {
    try {
      logger.info(`---REQUEST_COMMENT.CONTROLLER.FIND_ALL INIT---`);
      const result = await this.requestCommentService.findAll(query);
      logger.info(`---REQUEST_COMMENT.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des commentaires',
        data: result.data,
        pagination: {
          page: result.page,
          total: result.total,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error(
        `---REQUEST_COMMENT.CONTROLLER.FIND_ALL ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('request/:requestId')
  async findByRequest(@Param('requestId') requestId: string, @Res() res) {
    try {
      logger.info(
        `---REQUEST_COMMENT.CONTROLLER.FIND_BY_REQUEST INIT--- requestId=${requestId}`,
      );
      const comments = await this.requestCommentService.findByRequest(
        requestId,
      );
      logger.info(
        `---REQUEST_COMMENT.CONTROLLER.FIND_BY_REQUEST SUCCESS--- requestId=${requestId}`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Commentaires de la demande',
        data: comments,
      });
    } catch (error) {
      logger.error(
        `---REQUEST_COMMENT.CONTROLLER.FIND_BY_REQUEST ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---REQUEST_COMMENT.CONTROLLER.FIND_ONE INIT--- id=${id}`);
      const comment = await this.requestCommentService.findOne(id);
      logger.info(`---REQUEST_COMMENT.CONTROLLER.FIND_ONE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Commentaire',
        data: comment,
      });
    } catch (error) {
      logger.error(
        `---REQUEST_COMMENT.CONTROLLER.FIND_ONE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRequestCommentDto: UpdateRequestCommentDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      logger.info(`---REQUEST_COMMENT.CONTROLLER.UPDATE INIT--- id=${id}`);
      const authorId = req.user._id || req.user.userId || req.user.id;
      const comment = await this.requestCommentService.update(
        id,
        updateRequestCommentDto,
        authorId,
      );
      logger.info(`---REQUEST_COMMENT.CONTROLLER.UPDATE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Commentaire mis à jour avec succès',
        data: comment,
      });
    } catch (error) {
      logger.error(
        `---REQUEST_COMMENT.CONTROLLER.UPDATE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      logger.info(`---REQUEST_COMMENT.CONTROLLER.REMOVE INIT--- id=${id}`);
      const authorId = req.user._id || req.user.userId || req.user.id;
      const userRole = req.user.role;
      await this.requestCommentService.remove(id, authorId, userRole);
      logger.info(`---REQUEST_COMMENT.CONTROLLER.REMOVE SUCCESS--- id=${id}`);
      return res.status(HttpStatus.OK).json({
        message: 'Commentaire supprimé avec succès',
      });
    } catch (error) {
      logger.error(
        `---REQUEST_COMMENT.CONTROLLER.REMOVE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
