// src/auth/guards/roles.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEYS } from '../decorators/role.decorator';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      ROLE_KEYS,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // No roles required for this route
    }

    const { user } = context.switchToHttp().getRequest();

    // Check if the user's roles include any of the required roles
    if (!user || !requiredRoles.some((role) => user.role?.includes(role))) {
      throw new UnauthorizedException('Access denied: Insufficient permissions');
    }

    return true;
  }
}
