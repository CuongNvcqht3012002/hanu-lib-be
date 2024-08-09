import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE_ENUM[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ])

    // If no specific roles are defined, allow access for all users.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    // If there is no user in the request, deny access.
    if (!user) {
      return false
    }

    const userRole: ROLE_ENUM = user.role
    // If the user is an admin, allow access.
    if (userRole === ROLE_ENUM.ADMIN) return true

    const hasRole = requiredRoles.includes(userRole)

    if (!hasRole) {
      throw new ForbiddenException('Tài khoản của bạn không đủ quyền truy cập!')
    }

    return true
  }
}
