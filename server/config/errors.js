/**
 * server/config/errors.js — 统一错误定义
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'UNKNOWN_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.timestamp = new Date().toISOString()
  }
}

export class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 400, 'VALIDATION_ERROR')
    this.details = details
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class AuthError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'AUTH_ERROR')
  }
}

export class ProviderError extends AppError {
  constructor(message, providerName = 'unknown', originalError = null) {
    super(message, 503, 'PROVIDER_ERROR')
    this.providerName = providerName
    this.originalError = originalError
  }
}

export class TimeoutError extends AppError {
  constructor(message = 'Request timeout') {
    super(message, 504, 'TIMEOUT_ERROR')
  }
}

export default {
  AppError,
  ValidationError,
  NotFoundError,
  AuthError,
  ProviderError,
  TimeoutError,
}
