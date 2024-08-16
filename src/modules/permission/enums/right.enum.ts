export enum RIGHT_ENUM {
  // Reader Account Management
  VIEW_READERS = 'VIEW_READERS', // View list of readers
  CREATE_READER = 'CREATE_READER', // Create a reader account
  UPDATE_READER = 'UPDATE_READER', // Update reader account (Edit personal information)
  TOGGLE_LOCK_READER = 'TOGGLE_LOCK_READER', // Toggle lock status of reader account
  DELETE_READER = 'DELETE_READER', // Delete reader account (Admin can view deletion history with timestamp and reason)

  // Employee Account Management
  VIEW_EMPLOYEES = 'VIEW_EMPLOYEES', // View list of employees
  CREATE_EMPLOYEE = 'CREATE_EMPLOYEE', // Create an employee account
  UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE', // Update employee account (Edit personal information)
  DELETE_EMPLOYEE = 'DELETE_EMPLOYEE', // Delete employee account (Admin can view deletion history with timestamp and reason)

  // Group Room Management
  VIEW_ROOMS = 'VIEW_ROOMS', // View room information/status
  CREATE_ROOM = 'CREATE_ROOM', // Add room information/status (approve/disapprove for booking)
  UPDATE_ROOM = 'UPDATE_ROOM', // Update room information/status (notification required when user selects a locked room)
  DELETE_ROOM = 'DELETE_ROOM', // Delete room information/status

  // Order management
  VIEW_ORDERS = 'VIEW_ORDERS', // View list of orders
  CREATE_ORDER = 'CREATE_ORDER', // Create an order
  UPDATE_ORDER = 'UPDATE_ORDER', // Update order (Edit order information)

  // Reporting and Statistics
  // READER_BOOKING_HISTORY = 'READER_BOOKING_HISTORY', // Generate user booking history report by day/week/month/year
  // SUB_ADMIN_ACTIVITY_HISTORY = 'SUB_ADMIN_ACTIVITY_HISTORY', // Generate activity history report for Sub-Admin accounts

  // Administrative Permissions
  SET_PERMISSIONS = 'SET_PERMISSIONS', // Set administrative permissions
}
