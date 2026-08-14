import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { env } from '../config/env.js'
import { AppError, asyncHandler } from '../utils/api.js'

export const authenticate = asyncHandler(async (request, _response, next) => {
  const authorization = request.headers.authorization || ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null
  if (!token) throw new AppError(401, 'AUTH_REQUIRED', 'Authentication token is required.')

  let payload
  try {
    payload = jwt.verify(token, env.jwtSecret)
  } catch {
    throw new AppError(401, 'INVALID_TOKEN', 'Authentication token is invalid or expired.')
  }

  const user = await User.findById(payload.sub)
  if (!user || !user.isActive) throw new AppError(401, 'ACCOUNT_UNAVAILABLE', 'Account is unavailable.')
  request.user = user
  next()
})

export const optionalAuthenticate = asyncHandler(async (request, _response, next) => {
  const authorization = request.headers.authorization || ''
  if (!authorization.startsWith('Bearer ')) return next()
  try {
    const payload = jwt.verify(authorization.slice(7), env.jwtSecret)
    const user = await User.findById(payload.sub)
    if (user?.isActive) request.user = user
  } catch {
    // Public endpoint remains available; an invalid optional token is ignored.
  }
  next()
})

export const authorize = (...roles) => (request, _response, next) => {
  if (!request.user || !roles.includes(request.user.role)) {
    return next(new AppError(403, 'FORBIDDEN', 'You do not have permission to perform this action.'))
  }
  next()
}
