import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ROLE_KEY } from 'src/common/decorators/role.decorator';
import { ForbiddenMessage } from 'src/common/enums/message.enum';
import { Roles } from 'src/common/enums/role.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length == 0) return true;
    const request: Request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserEntity;
    const userRole = user.role ?? Roles.User;
    if (user.role === Roles.Admin) return true;
    if (requiredRoles.includes(userRole as Roles)) return true;
    throw new ForbiddenException(ForbiddenMessage.RoleForbidden);
  }
}
