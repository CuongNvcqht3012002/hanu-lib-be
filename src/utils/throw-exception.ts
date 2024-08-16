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
  throw new NotFoundException({
    statusCode: 404,
    error: message || ErrorMessages.NOT_FOUND,
  })
}

function HttpBadRequest(message = '') {
  throw new BadRequestException({
    statusCode: 400,
    error: message || ErrorMessages.BAD_REQUEST,
  })
}

function HttpUnprocessableEntity(message = '') {
  throw new UnprocessableEntityException({
    statusCode: 422,
    error: message || ErrorMessages.UNPROCESSABLE_ENTITY,
  })
}

function HttpForbidden(message = '') {
  throw new ForbiddenException({
    statusCode: 403,
    error: message || ErrorMessages.FORBIDDEN,
  })
}

function HttpUnauthorized(message = '') {
  throw new UnauthorizedException({
    statusCode: 401,
    error: message || ErrorMessages.UNAUTHORIZED,
  })
}

export {
  HttpNotFound,
  HttpBadRequest,
  HttpUnprocessableEntity,
  HttpForbidden,
  HttpUnauthorized,
  ErrorMessages,
}
