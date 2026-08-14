import { AppError } from '../utils/api.js'

export function notFound(request, _response, next) {
  next(new AppError(404, 'ROUTE_NOT_FOUND', `Route ${request.method} ${request.originalUrl} was not found.`))
}

export function errorHandler(error, _request, response, _next) {
  let status = error.status || 500
  let code = error.code || 'INTERNAL_ERROR'
  let message = error.message || 'An unexpected error occurred.'
  let details = error.details

  if (error.name === 'ValidationError') {
    status = 422
    code = 'VALIDATION_ERROR'
    message = 'Submitted data is invalid.'
    details = Object.values(error.errors).map((item) => ({ field: item.path, message: item.message }))
  }

  if (error.name === 'CastError') {
    status = 400
    code = 'INVALID_ID'
    message = `Invalid ${error.path}.`
  }

  if (error.code === 11000) {
    status = 409
    code = 'DUPLICATE_VALUE'
    message = `${Object.keys(error.keyValue || {})[0] || 'Value'} already exists.`
  }

  if (error.name === 'MulterError') {
    status = 422
    code = error.code || 'UPLOAD_ERROR'
    message = error.code === 'LIMIT_FILE_SIZE' ? 'Each image must be 5MB or smaller.' : 'Images could not be uploaded.'
  }

  if (status >= 500) console.error(error)
  response.status(status).json({ success: false, error: { code, message, ...(details ? { details } : {}) } })
}
