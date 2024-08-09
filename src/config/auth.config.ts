import { registerAs } from '@nestjs/config'

export default registerAs('auth', () => ({
  secret: process.env.AUTH_JWT_SECRET,
  expiresAccessToken: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN,
  expiresRefreshToken: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN,
  // 3600 seconds = 1 hour
  codeExpires: parseInt(process.env.AUTH_CODE_EXPIRES_IN, 10) || 3600,
}))
