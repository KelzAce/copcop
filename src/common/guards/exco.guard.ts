import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/user/entities/roles.enum';

@Injectable()
export class ExcoGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = [Role.PRESIDENT, Role.FINANCIAL_SECRETARY, Role.SECRETARY];
    const { user } = context.switchToHttp().getRequest();

    // Check if the user's role is one of the Excos
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
