import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/constants/enums';
import { UserRolGuard } from '../guards/user-rol/user-rol.guard';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: Roles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    SetMetadata('roles', roles),
    UseGuards(AuthGuard(), UserRolGuard),
  );
}
