import {
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'

const ErrorMessages = {
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  BAD_REQUEST: 'Yêu cầu không hợp lệ.',
  UNPROCESSABLE_ENTITY: 'Không thể xử lý yêu cầu.',
  FORBIDDEN: 'Bạn không có quyền truy cập.',
  UNAUTHORIZED: 'Xác thực không thành công.',
}

function HttpNotFound(message = '') {
  throw new NotFoundException(message || ErrorMessages.NOT_FOUND)
}

function HttpBadRequest(message = '') {
  throw new BadRequestException(message || ErrorMessages.BAD_REQUEST)
}

function HttpUnprocessableEntity(message = '') {
  throw new UnprocessableEntityException(message || ErrorMessages.UNPROCESSABLE_ENTITY)
}

function HttpForbidden(message = '') {
  throw new ForbiddenException(message || ErrorMessages.FORBIDDEN)
}

function HttpUnauthorized(message = '') {
  throw new UnauthorizedException(message || ErrorMessages.UNAUTHORIZED)
}

export {
  HttpNotFound,
  HttpBadRequest,
  HttpUnprocessableEntity,
  HttpForbidden,
  HttpUnauthorized,
  ErrorMessages,
}
