import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/api/auth/auth.service';
import { UserStatus } from 'src/utils/enums/user_status.enum';
import { sanitizeUser } from 'src/utils/functions/sanitizer';
import logger from 'src/utils/logger';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info(`---MIDDLEWARE STAGE INIT---`);
      let token = req.headers['authorization'];

      if (token && token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
      if (!token) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      const verifyToken = await this.authService.verifyToken(token.toString());
      const user = await this.authService.findByEmail(verifyToken.email);
      if (user.active == false || user.status == UserStatus.SUSPENDED) {
        throw new HttpException('User suspended', HttpStatus.UNAUTHORIZED);
      }
      const sanitizedUser = await sanitizeUser(user);
      req['user'] = sanitizedUser;
      next();
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }
}
