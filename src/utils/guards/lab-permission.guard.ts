import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '../enums/roles.enum';

@Injectable()
export class LabPermissionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const labId = request.params.labId || request.body.lab || request.query.lab;

    if (!user) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    // SuperAdmin peut tout faire
    if (user.role === Role.SuperAdmin) {
      return true;
    }

    // LabAdmin peut agir uniquement sur son propre labo
    if (user.role === Role.LabAdmin) {
      if (!user.lab) {
        throw new ForbiddenException(
          'Vous devez être associé à un laboratoire',
        );
      }
      if (labId && user.lab.toString() !== labId.toString()) {
        throw new ForbiddenException(
          "Vous n'avez pas le droit d'agir sur ce laboratoire",
        );
      }
      return true;
    }

    // LabStaff ne peut pas modifier (seulement voir)
    if (user.role === Role.LabStaff) {
      throw new ForbiddenException(
        "Vous n'avez pas les permissions nécessaires pour cette action",
      );
    }

    throw new ForbiddenException('Permissions insuffisantes');
  }
}
