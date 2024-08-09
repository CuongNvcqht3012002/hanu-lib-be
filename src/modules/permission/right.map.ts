import { RIGHT_ENUM } from 'src/modules/permission/enums/right.enum'

export const rightMap = {
  // Reader Account Management
  [RIGHT_ENUM.VIEW_READERS]: { tag: 'reader', name: 'Xem danh sách bạn đọc' },
  [RIGHT_ENUM.CREATE_READER]: { tag: 'reader', name: 'Thêm tài khoản bạn đọc' },
  [RIGHT_ENUM.UPDATE_READER]: { tag: 'reader', name: 'Sửa tài khoản bạn đọc' },
  [RIGHT_ENUM.TOGGLE_LOCK_READER]: { tag: 'reader', name: 'Khóa/Mở khóa tài khoản bạn đọc' },
  [RIGHT_ENUM.DELETE_READER]: { tag: 'reader', name: 'Xóa tài khoản bạn đọc' },

  // Employee Management: Sub-Admin
  [RIGHT_ENUM.VIEW_EMPLOYEES]: { tag: 'employee', name: 'Xem danh sách cán bộ' },
  [RIGHT_ENUM.CREATE_EMPLOYEE]: { tag: 'employee', name: 'Thêm tài khoản cán bộ' },
  [RIGHT_ENUM.UPDATE_EMPLOYEE]: { tag: 'employee', name: 'Sửa tài khoản cán bộ' },
  [RIGHT_ENUM.DELETE_EMPLOYEE]: { tag: 'employee', name: 'Xóa tài khoản cán bộ' },

  // Room Management
  [RIGHT_ENUM.VIEW_ROOMS]: { tag: 'room', name: 'Xem danh sách phòng học' },
  [RIGHT_ENUM.CREATE_ROOM]: { tag: 'room', name: 'Thêm phòng học' },
  [RIGHT_ENUM.UPDATE_ROOM]: { tag: 'room', name: 'Sửa thông tin phòng học' },
  [RIGHT_ENUM.DELETE_ROOM]: { tag: 'room', name: 'Xóa thông tin phòng học' },

  // order Management
  [RIGHT_ENUM.VIEW_ORDERS]: { tag: 'order', name: 'Xem danh sách đơn hàng' },
  [RIGHT_ENUM.CREATE_ORDER]: { tag: 'order', name: 'Tạo đơn hàng' },
  [RIGHT_ENUM.UPDATE_ORDER]: { tag: 'order', name: 'Sửa thông tin đơn hàng' },

  // Reporting and Statistics
  // [RIGHT_ENUM.READER_BOOKING_HISTORY]: { tag: 'report', name: 'Xem lịch sử đặt phòng của bạn đọc' },
  // [RIGHT_ENUM.SUB_ADMIN_ACTIVITY_HISTORY]: { tag: 'report', name: 'Xem lịch sử hoạt động của Sub-Admin' },

  // Administrative Permissions
  [RIGHT_ENUM.SET_PERMISSIONS]: { tag: 'admin', name: 'Thiết lập phân quyền' },
}
