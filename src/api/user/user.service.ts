/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLabStaffDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import logger from 'src/utils/logger';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { sanitizeUser } from 'src/utils/functions/sanitizer';
import { Role } from 'src/utils/enums/roles.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto | CreateLabStaffDto) {
    try {
      logger.info(`---USER.SERVICE.CREATE INIT---`);
      await this.checkPhoneNumber(createUserDto.phoneNumber);
      const user = new this.userModel(createUserDto);
      const password = '123456';
      user.password = password;
      await user.save();
      logger.info(`---USER.SERVICE.CREATE SUCCESS---`);
      return sanitizeUser(user);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    firstname?: string;
    lastname?: string;
    bloodGroup?: string;
    email?: string;
    lab?: string;
  }): Promise<any> {
    try {
      const {
        page = 1,
        limit = 10,
        firstname,
        lastname,
        bloodGroup,
        email,
        lab,
      } = query;

      const filters: any = {};

      if (firstname) filters.firstname = { $regex: firstname, $options: 'i' };
      if (lastname) filters.lastname = { $regex: lastname, $options: 'i' };
      if (bloodGroup)
        filters.bloodGroup = { $regex: `^${bloodGroup}$`, $options: 'i' };
      if (email) filters.email = { $regex: email, $options: 'i' };
      if (lab) filters.lab = lab;

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.userModel
          .find(filters)
          .skip(skip)
          .limit(limit)
          .sort({ created_at: -1 })
          .select('-password')
          .populate({
            path: 'lab',
            select: 'structure',
            populate: [{ path: 'structure', select: 'name' }],
          })
          .lean(),
        this.userModel.countDocuments(filters),
      ]);

      return {
        data,
        limit,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || 500,
      );
    }
  }

  async findOne(userId: string) {
    try {
      const user = await this.userModel
        .findById(userId)
        .select('-password')
        .populate({
          path: 'lab',
          select: 'structure',
          populate: [{ path: 'structure', select: 'name' }],
        });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ phoneNumber, active: true });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findByEmail(email: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email, active: true });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async checkPhoneNumber(phoneNumber: string) {
    try {
      const user = await this.userModel.findOne({
        phoneNumber,
      });
      if (user) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findLogin(createAuthDto: CreateAuthDto) {
    try {
      const user = await this.findByEmail(createAuthDto.email);
      const passwordMatched = await bcrypt.compare(
        createAuthDto.password,
        user.password,
      );

      if (!passwordMatched) {
        throw new HttpException(
          'Phone number or password incorrect',
          HttpStatus.NOT_FOUND,
        );
      }
      return sanitizeUser(user);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      logger.info(`---USER.SERVICE.UPDATE INIT---`);
      const updated = await this.userModel
        .findByIdAndUpdate(
          id,
          { ...updateUserDto, updated_at: new Date() },
          { new: true },
        )
        .select('-password')
        .exec();
      if (!updated) {
        throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---USER.SERVICE.UPDATE SUCCESS---`);
      return sanitizeUser(updated);
    } catch (error) {
      logger.error(`---USER.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---USER.SERVICE.REMOVE INIT---`);
      // Soft delete - désactiver l'utilisateur au lieu de le supprimer
      const deleted = await this.userModel
        .findByIdAndUpdate(
          id,
          { active: false, updated_at: new Date() },
          { new: true },
        )
        .select('-password')
        .exec();
      if (!deleted) {
        throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---USER.SERVICE.REMOVE SUCCESS---`);
      return sanitizeUser(deleted);
    } catch (error) {
      logger.error(`---USER.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  isSuperAdminOrLabAdmin(user: User, labId: string) {
    return (
      user.role == Role.SuperAdmin ||
      (user.role == Role.LabAdmin &&
        (String(user.lab?._id) || String(user.lab)) == labId)
    );
  }
}
