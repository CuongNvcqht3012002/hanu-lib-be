import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { HttpBadRequest } from '@/utils/throw-exception'
import { User } from '@/modules/users/entities/user.entity'
import { TOKEN_TYPE_ENUM } from '@/modules/auth/enums/tokens.enum'

type JwtPayload = Pick<User, 'id' | 'role'> & { iat: number; exp: number; type: TOKEN_TYPE_ENUM }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret'),
    })
  }

  public async validate(payload: JwtPayload) {
    // Check token: It must be accessToken
    if (payload.type !== TOKEN_TYPE_ENUM.ACCESS_TOKEN)
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn.')

    // We need to find user because when user was deleted, token will be expired. Or Id from payload is not exist in database
    const currentUser = await this.usersRepository.findOne({
      where: { id: payload.id },
      relations: ['groups', 'groups.rights'],
    })

    if (!currentUser) throw new UnauthorizedException('Token không hợp lệ hoặc Không tìm thấy user')

    if (currentUser.isLocked)
      HttpBadRequest(
        'Tài khoản của bạn đang bị khóa. Vui lòng liên hệ ban quản lý thư viện để được hỗ trợ.'
      )

    // Extract and deduplicate rights
    const rightsSet = new Set<string>()
    currentUser.groups.forEach((group) => {
      group.rights.forEach((right) => {
        rightsSet.add(right.enumValue)
      })
    })

    currentUser.rights = Array.from(rightsSet)
    currentUser.groups = null

    return currentUser
  }
}
