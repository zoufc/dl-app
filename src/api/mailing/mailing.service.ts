import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from 'src/providers/mail-service/mail.service';
import { MailTemplates } from 'src/providers/mail-service/mail.templates';
import { User } from 'src/api/user/interfaces/user.interface';
import { Lab } from 'src/api/labs/interfaces/labs.interface';
import { Role } from 'src/utils/enums/roles.enum';
import {
  SendToUsersDto,
  SendToRoleDto,
  SendMailDto,
} from './dto/send-mail.dto';
import logger from 'src/utils/logger';

@Injectable()
export class MailingService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Lab') private labModel: Model<Lab>,
    private mailService: MailService,
  ) {}

  /**
   * Envoie un email à des utilisateurs spécifiques
   */
  async sendToUsers(dto: SendToUsersDto) {
    try {
      logger.info(`---MAILING.SERVICE.SEND_TO_USERS INIT---`);

      // Vérifier qu'au moins emails ou userIds est fourni
      if (
        (!dto.userIds || dto.userIds.length === 0) &&
        (!dto.emails || dto.emails.length === 0)
      ) {
        throw new HttpException(
          'Vous devez fournir soit des userIds, soit des emails, soit les deux',
          HttpStatus.BAD_REQUEST,
        );
      }

      let emails: string[] = [];

      // Si des userIds sont fournis, récupérer les emails
      if (dto.userIds && dto.userIds.length > 0) {
        const users = await this.userModel
          .find({
            _id: { $in: dto.userIds },
            active: true,
          })
          .select('email firstname lastname')
          .exec();

        emails = users
          .map((user) => user.email)
          .filter((email) => email && email.trim() !== '');

        logger.info(
          `---MAILING.SERVICE.SEND_TO_USERS--- Found ${emails.length} emails from ${dto.userIds.length} userIds`,
        );
      }

      // Ajouter les emails directs si fournis
      if (dto.emails && dto.emails.length > 0) {
        emails = [...emails, ...dto.emails];
      }

      // Supprimer les doublons
      emails = [...new Set(emails)];

      if (emails.length === 0) {
        throw new HttpException(
          'Aucun email valide trouvé. Veuillez fournir des userIds ou des emails valides.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Préparer le contenu HTML
      const html = MailTemplates.genericEmail(
        dto.subject,
        dto.content,
        dto.buttonText,
        dto.buttonUrl,
      );

      // Envoyer l'email à tous les destinataires
      await this.mailService.sendMail({
        to: emails,
        subject: dto.subject,
        html,
      });

      logger.info(
        `---MAILING.SERVICE.SEND_TO_USERS SUCCESS--- Sent to ${emails.length} recipients`,
      );

      return {
        success: true,
        message: `Email envoyé avec succès à ${emails.length} destinataire(s)`,
        recipientsCount: emails.length,
        recipients: emails,
      };
    } catch (error) {
      logger.error(
        `---MAILING.SERVICE.SEND_TO_USERS ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message || "Erreur lors de l'envoi des emails",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Envoie un email à tous les directeurs de laboratoire
   */
  async sendToDirectors(dto: SendMailDto) {
    try {
      logger.info(`---MAILING.SERVICE.SEND_TO_DIRECTORS INIT---`);

      // Récupérer tous les labs avec leurs directeurs
      const labs = await this.labModel
        .find({ director: { $exists: true, $ne: null } })
        .populate('director', 'email firstname lastname active')
        .select('director')
        .exec();

      // Extraire les emails des directeurs actifs
      const emails = labs
        .map((lab: any) => {
          const director = lab.director;
          if (director && director.active && director.email) {
            return director.email;
          }
          return null;
        })
        .filter((email) => email && email.trim() !== '');

      // Supprimer les doublons (un directeur peut diriger plusieurs labs)
      const uniqueEmails = [...new Set(emails)];

      if (uniqueEmails.length === 0) {
        throw new HttpException(
          'Aucun directeur de laboratoire trouvé avec un email valide',
          HttpStatus.NOT_FOUND,
        );
      }

      // Préparer le contenu HTML
      const html = MailTemplates.genericEmail(
        dto.subject,
        dto.content,
        dto.buttonText,
        dto.buttonUrl,
      );

      // Envoyer l'email
      await this.mailService.sendMail({
        to: uniqueEmails,
        subject: dto.subject,
        html,
      });

      logger.info(
        `---MAILING.SERVICE.SEND_TO_DIRECTORS SUCCESS--- Sent to ${uniqueEmails.length} directors`,
      );

      return {
        success: true,
        message: `Email envoyé avec succès à ${uniqueEmails.length} directeur(s)`,
        recipientsCount: uniqueEmails.length,
        recipients: uniqueEmails,
      };
    } catch (error) {
      logger.error(
        `---MAILING.SERVICE.SEND_TO_DIRECTORS ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message || "Erreur lors de l'envoi des emails",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Envoie un email à tous les utilisateurs ayant un rôle spécifique
   */
  async sendToRole(dto: SendToRoleDto) {
    try {
      logger.info(`---MAILING.SERVICE.SEND_TO_ROLE INIT--- role=${dto.role}`);

      // Valider le rôle
      const validRoles = Object.values(Role);
      if (!validRoles.includes(dto.role as Role)) {
        throw new HttpException(
          `Rôle invalide. Rôles valides: ${validRoles.join(', ')}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Récupérer tous les utilisateurs avec ce rôle et actifs
      const users = await this.userModel
        .find({
          role: dto.role,
          active: true,
        })
        .select('email firstname lastname')
        .exec();

      // Extraire les emails valides
      const emails = users
        .map((user) => user.email)
        .filter((email) => email && email.trim() !== '');

      if (emails.length === 0) {
        throw new HttpException(
          `Aucun utilisateur trouvé avec le rôle ${dto.role} et un email valide`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Préparer le contenu HTML
      const html = MailTemplates.genericEmail(
        dto.subject,
        dto.content,
        dto.buttonText,
        dto.buttonUrl,
      );

      // Envoyer l'email
      await this.mailService.sendMail({
        to: emails,
        subject: dto.subject,
        html,
      });

      logger.info(
        `---MAILING.SERVICE.SEND_TO_ROLE SUCCESS--- Sent to ${emails.length} users with role ${dto.role}`,
      );

      return {
        success: true,
        message: `Email envoyé avec succès à ${emails.length} utilisateur(s) avec le rôle ${dto.role}`,
        recipientsCount: emails.length,
        role: dto.role,
        recipients: emails,
      };
    } catch (error) {
      logger.error(`---MAILING.SERVICE.SEND_TO_ROLE ERROR--- ${error.message}`);
      throw new HttpException(
        error.message || "Erreur lors de l'envoi des emails",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Envoie un email à tous les Super Admins
   */
  async sendToSuperAdmins(dto: SendMailDto) {
    return this.sendToRole({
      ...dto,
      role: Role.SuperAdmin,
    });
  }

  /**
   * Envoie un email à tous les Lab Admins
   */
  async sendToLabAdmins(dto: SendMailDto) {
    return this.sendToRole({
      ...dto,
      role: Role.LabAdmin,
    });
  }

  /**
   * Envoie un email à tous les Region Admins
   */
  async sendToRegionAdmins(dto: SendMailDto) {
    return this.sendToRole({
      ...dto,
      role: Role.RegionAdmin,
    });
  }
}
