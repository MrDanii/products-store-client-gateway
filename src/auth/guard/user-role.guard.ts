import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { META_ROLES } from '../decorators';
import { UserJwtRequest } from '../interfaces/user-jwt.interface';
// import { META_ROLES } from '../../../auth/decorators/role-protected.decorator';
// import { User } from '../../../auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  // to watch metadata
  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())
    // console.log(validRoles)

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as UserJwtRequest

    if (!user) {
      throw new BadRequestException('User not found')
    }

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        // console.log(`role: ${role} -- valid-roles: [${validRoles}]`)
        return true
      }
    }

    throw new ForbiddenException(
      `User ${user.fullName} needs a valid role: [${validRoles}]`
    )
  }
}
