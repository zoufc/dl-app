import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestComment } from './interfaces/request-comment.interface';
import { Request } from '../requests/entities/request.entity';
import { CreateRequestCommentDto } from './dto/create-request-comment.dto';
import { UpdateRequestCommentDto } from './dto/update-request-comment.dto';
import { FindRequestCommentDto } from './dto/find-request-comment.dto';
import logger from 'src/utils/logger';

@Injectable()
export class RequestCommentService {
  constructor(
    @InjectModel('RequestComment')
    private requestCommentModel: Model<RequestComment>,
    @InjectModel('Request') private requestModel: Model<Request>,
  ) {}

  async create(
    createRequestCommentDto: CreateRequestCommentDto,
    authorId: string,
  ): Promise<any> {
    try {
      logger.info(`---REQUEST_COMMENT.SERVICE.CREATE INIT---`);

      // Vérifier que la demande existe
      const request = await this.requestModel.findById(
        createRequestCommentDto.request,
      );
      if (!request) {
        throw new HttpException('Demande non trouvée', HttpStatus.NOT_FOUND);
      }

      const comment = await this.requestCommentModel.create({
        ...createRequestCommentDto,
        author: authorId,
      });

      await comment.populate('author', 'firstname lastname email');
      await comment.populate('request', 'type status referenceNumber');

      logger.info(`---REQUEST_COMMENT.SERVICE.CREATE SUCCESS---`);
      return comment;
    } catch (error) {
      logger.error(
        `---REQUEST_COMMENT.SERVICE.CREATE ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message || 'Erreur lors de la création du commentaire',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: FindRequestCommentDto): Promise<any> {
    try {
      logger.info(`---REQUEST_COMMENT.SERVICE.FIND_ALL INIT---`);

      const { page = 1, limit = 10, request, author } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (request) filters.request = request;
      if (author) filters.author = author;

      const [data, total] = await Promise.all([
        this.requestCommentModel
          .find(filters)
          .populate('author', 'firstname lastname email')
          .populate('request', 'type status referenceNumber')
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.requestCommentModel.countDocuments(filters),
      ]);

      logger.info(`---REQUEST_COMMENT.SERVICE.FIND_ALL SUCCESS---`);
      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error(
        `---REQUEST_COMMENT.SERVICE.FIND_ALL ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message || 'Erreur lors de la récupération des commentaires',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByRequest(requestId: string): Promise<any> {
    try {
      logger.info(
        `---REQUEST_COMMENT.SERVICE.FIND_BY_REQUEST INIT--- requestId=${requestId}`,
      );

      const comments = await this.requestCommentModel
        .find({ request: requestId })
        .populate('author', 'firstname lastname email')
        .sort({ created_at: -1 })
        .lean();

      logger.info(
        `---REQUEST_COMMENT.SERVICE.FIND_BY_REQUEST SUCCESS--- requestId=${requestId}`,
      );
      return comments;
    } catch (error) {
      logger.error(
        `---REQUEST_COMMENT.SERVICE.FIND_BY_REQUEST ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message || 'Erreur lors de la récupération des commentaires',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      logger.info(`---REQUEST_COMMENT.SERVICE.FIND_ONE INIT--- id=${id}`);

      const comment = await this.requestCommentModel
        .findById(id)
        .populate('author', 'firstname lastname email')
        .populate('request', 'type status referenceNumber')
        .lean();

      if (!comment) {
        throw new HttpException('Commentaire non trouvé', HttpStatus.NOT_FOUND);
      }

      logger.info(`---REQUEST_COMMENT.SERVICE.FIND_ONE SUCCESS--- id=${id}`);
      return comment;
    } catch (error) {
      logger.error(
        `---REQUEST_COMMENT.SERVICE.FIND_ONE ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message || 'Erreur lors de la récupération du commentaire',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateRequestCommentDto: UpdateRequestCommentDto,
    authorId: string,
  ): Promise<any> {
    try {
      logger.info(`---REQUEST_COMMENT.SERVICE.UPDATE INIT--- id=${id}`);

      // Vérifier que le commentaire existe et appartient à l'auteur
      const comment = await this.requestCommentModel.findById(id);
      if (!comment) {
        throw new HttpException('Commentaire non trouvé', HttpStatus.NOT_FOUND);
      }

      // Vérifier que l'auteur est le propriétaire du commentaire
      if (comment.author.toString() !== authorId) {
        throw new HttpException(
          'Vous ne pouvez modifier que vos propres commentaires',
          HttpStatus.FORBIDDEN,
        );
      }

      const updated = await this.requestCommentModel
        .findByIdAndUpdate(
          id,
          { ...updateRequestCommentDto, updated_at: new Date() },
          { new: true },
        )
        .populate('author', 'firstname lastname email')
        .populate('request', 'type status referenceNumber')
        .lean();

      logger.info(`---REQUEST_COMMENT.SERVICE.UPDATE SUCCESS--- id=${id}`);
      return updated;
    } catch (error) {
      logger.error(
        `---REQUEST_COMMENT.SERVICE.UPDATE ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message || 'Erreur lors de la mise à jour du commentaire',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, authorId: string, userRole: string): Promise<any> {
    try {
      logger.info(`---REQUEST_COMMENT.SERVICE.REMOVE INIT--- id=${id}`);

      const comment = await this.requestCommentModel.findById(id);
      if (!comment) {
        throw new HttpException('Commentaire non trouvé', HttpStatus.NOT_FOUND);
      }

      // Seuls les admins ou l'auteur du commentaire peuvent le supprimer
      const isAdmin =
        userRole === 'super_admin' ||
        userRole === 'region_admin' ||
        userRole === 'lab_admin';
      const isAuthor = comment.author.toString() === authorId;

      if (!isAdmin && !isAuthor) {
        throw new HttpException(
          'Vous ne pouvez supprimer que vos propres commentaires',
          HttpStatus.FORBIDDEN,
        );
      }

      const deleted = await this.requestCommentModel.findByIdAndDelete(id);

      logger.info(`---REQUEST_COMMENT.SERVICE.REMOVE SUCCESS--- id=${id}`);
      return deleted;
    } catch (error) {
      logger.error(
        `---REQUEST_COMMENT.SERVICE.REMOVE ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message || 'Erreur lors de la suppression du commentaire',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
