import * as bcrypt from 'bcryptjs'

export async function encryptPassword(rawPassword: string) {
  const salt = await bcrypt.genSalt()
  const password = await bcrypt.hash(rawPassword, salt)
  return password
}
