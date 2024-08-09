import { RIGHT_ENUM } from '@/modules/permission/enums/right.enum'
import { SetMetadata } from '@nestjs/common'

export const Rights = (...rights: RIGHT_ENUM[]) => SetMetadata('rights', rights)
