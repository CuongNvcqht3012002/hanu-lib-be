import { User } from 'src/modules/users/entities/user.entity'

export interface IAuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}
