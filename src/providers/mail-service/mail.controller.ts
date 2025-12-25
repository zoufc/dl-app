import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { MailService, MailOptions } from './mail.service';
import logger from 'src/utils/logger';

export class SendTestEmailDto {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  /**
   * Endpoint de test pour vérifier la connexion au serveur mail
   */
  @Get('verify')
  async verifyConnection(@Res() res) {
    try {
      logger.info('---MAIL.CONTROLLER.VERIFY INIT---');
      const isConnected = await this.mailService.verifyConnection();
      if (isConnected) {
        return res.status(HttpStatus.OK).json({
          message: 'Connexion au serveur mail réussie',
          connected: true,
        });
      } else {
        return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
          message: 'Impossible de se connecter au serveur mail',
          connected: false,
        });
      }
    } catch (error) {
      logger.error(`---MAIL.CONTROLLER.VERIFY ERROR--- ${error.message}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erreur lors de la vérification de la connexion',
        error: error.message,
      });
    }
  }

  /**
   * Endpoint de test pour envoyer un email
   */
  @Post('test')
  async sendTestEmail(@Body() sendTestEmailDto: SendTestEmailDto, @Res() res) {
    try {
      logger.info('---MAIL.CONTROLLER.SEND_TEST INIT---');
      const mailOptions: MailOptions = {
        to: sendTestEmailDto.to,
        subject: sendTestEmailDto.subject,
        text: sendTestEmailDto.text,
        html: sendTestEmailDto.html,
      };

      await this.mailService.sendMail(mailOptions);
      logger.info('---MAIL.CONTROLLER.SEND_TEST SUCCESS---');
      return res.status(HttpStatus.OK).json({
        message: 'Email envoyé avec succès',
      });
    } catch (error) {
      logger.error(`---MAIL.CONTROLLER.SEND_TEST ERROR--- ${error.message}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de l'envoi de l'email",
        error: error.message,
      });
    }
  }

  /**
   * Endpoint pour envoyer un email de bienvenue
   */
  @Post('welcome')
  async sendWelcomeEmail(
    @Body() body: { to: string; name: string; password?: string },
    @Res() res,
  ) {
    try {
      logger.info('---MAIL.CONTROLLER.SEND_WELCOME INIT---');
      await this.mailService.sendWelcomeEmail(
        body.to,
        body.name,
        body.password,
      );
      logger.info('---MAIL.CONTROLLER.SEND_WELCOME SUCCESS---');
      return res.status(HttpStatus.OK).json({
        message: 'Email de bienvenue envoyé avec succès',
      });
    } catch (error) {
      logger.error(`---MAIL.CONTROLLER.SEND_WELCOME ERROR--- ${error.message}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de l'envoi de l'email de bienvenue",
        error: error.message,
      });
    }
  }

  /**
   * Endpoint pour envoyer un email de réinitialisation de mot de passe
   */
  @Post('password-reset')
  async sendPasswordResetEmail(
    @Body()
    body: {
      to: string;
      name: string;
      resetToken: string;
      resetUrl: string;
    },
    @Res() res,
  ) {
    try {
      logger.info('---MAIL.CONTROLLER.SEND_PASSWORD_RESET INIT---');
      await this.mailService.sendPasswordResetEmail(
        body.to,
        body.name,
        body.resetToken,
        body.resetUrl,
      );
      logger.info('---MAIL.CONTROLLER.SEND_PASSWORD_RESET SUCCESS---');
      return res.status(HttpStatus.OK).json({
        message: 'Email de réinitialisation envoyé avec succès',
      });
    } catch (error) {
      logger.error(
        `---MAIL.CONTROLLER.SEND_PASSWORD_RESET ERROR--- ${error.message}`,
      );
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de l'envoi de l'email de réinitialisation",
        error: error.message,
      });
    }
  }
}
