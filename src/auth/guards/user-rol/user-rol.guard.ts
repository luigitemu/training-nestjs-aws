import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Roles } from 'src/common/constants/enums';

@Injectable()
export class UserRolGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get<Roles[]>(
      META_ROLES,
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    if (!user) {
      throw new BadRequestException('User not found');
    }
    return validRoles.some((role) => user?.Roles.includes(+role));
  }
}
