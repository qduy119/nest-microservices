/* eslint-disable prettier/prettier */
import { IUserEntity, ROLE } from '@app/shared';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user }: { user: IUserEntity } = context.switchToHttp().getRequest();

    this.logger.debug('>>> DEBUG');
    this.logger.debug({ user, requiredRoles });

    const hasRole = () =>
      requiredRoles.some((role) => user.roles?.includes(role));

    if (user && user.roles && hasRole()) {
      return true;
    }
    throw new ForbiddenException('You are not allowed to do this action');
  }
}
