import { RIGHT_ENUM } from '@/modules/permission/enums/right.enum'
import { ROLE_ENUM } from '@/modules/roles/roles.enum'
import { User } from '@/modules/users/entities/user.entity'
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

@Injectable()
export class RightsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRights = this.reflector.getAllAndOverride<RIGHT_ENUM[]>('rights', [
      context.getClass(),
      context.getHandler(),
    ])

    if (!requiredRights || requiredRights.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const user = request.user as User

    // If there is no user in the request, deny access.
    if (!user) {
      return false
    }

    // Admin has all rights
    if (user.role === ROLE_ENUM.ADMIN) return true

    const userRights = user.rights

    const hasRight = () => requiredRights.every((right) => userRights.includes(right))

    if (!hasRight()) {
      throw new ForbiddenException('Bạn không có quyền truy cập vào tài nguyên này!')
    }

    return true
  }
}
