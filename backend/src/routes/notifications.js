import { Router } from 'express'
import Notification from '../models/Notification.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler, success } from '../utils/api.js'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { env } from '../config/env.js'
import { subscribeNotifications } from '../services/notifications.js'

const router = Router()

router.get('/stream', asyncHandler(async (request, response) => {
  let payload
  try { payload = jwt.verify(request.query.token || '', env.jwtSecret) } catch { return response.status(401).end() }
  const user = await User.findById(payload.sub).select('role')
  if (!user?.isActive) return response.status(401).end()
  response.setHeader('Content-Type', 'text/event-stream')
  response.setHeader('Cache-Control', 'no-cache, no-transform')
  response.setHeader('Connection', 'keep-alive')
  response.flushHeaders()
  const send = (notification) => {
    const allowed = ['admin', 'staff'].includes(user.role) ? ['admin', user.role].includes(notification.recipientRole) : String(notification.user || '') === String(user.id)
    if (allowed) response.write(`data: ${JSON.stringify(notification)}\n\n`)
  }
  const unsubscribe = subscribeNotifications(send)
  const heartbeat = setInterval(() => response.write(': keepalive\n\n'), 25000)
  request.on('close', () => { clearInterval(heartbeat); unsubscribe() })
}))

router.use(authenticate)

router.get('/', asyncHandler(async (request, response) => {
  const filter = ['admin', 'staff'].includes(request.user.role) ? { recipientRole: { $in: ['admin', request.user.role] } } : { user: request.user.id }
  const items = await Notification.find(filter).sort({ createdAt: -1 }).limit(30)
  return success(response, items, 200, { unread: items.filter((item) => !item.isRead).length })
}))

router.patch('/read-all', asyncHandler(async (request, response) => {
  const filter = ['admin', 'staff'].includes(request.user.role) ? { recipientRole: { $in: ['admin', request.user.role] } } : { user: request.user.id }
  await Notification.updateMany(filter, { isRead: true })
  return success(response, { updated: true })
}))

router.patch('/:id/read', asyncHandler(async (request, response) => {
  const filter = ['admin', 'staff'].includes(request.user.role)
    ? { _id: request.params.id, recipientRole: { $in: ['admin', request.user.role] } }
    : { _id: request.params.id, user: request.user.id }
  const item = await Notification.findOneAndUpdate(filter, { isRead: true }, { new: true })
  if (!item) return success(response, { updated: false })
  return success(response, item)
}))

export default router
