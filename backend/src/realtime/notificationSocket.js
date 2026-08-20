import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Notification from '../models/Notification.js'
import { env } from '../config/env.js'

let notificationIo

const filterFor = (socket) => socket.data.context === 'admin'
  ? { recipientRole: { $in: ['admin', socket.data.role] } }
  : { user: socket.data.userId }

async function sendState(socket) {
  const items = await Notification.find(filterFor(socket)).sort({ createdAt: -1 }).limit(30)
  socket.emit('notifications:state', { items, unread: items.filter((item) => !item.isRead).length })
}

export function attachNotificationSocket(server) {
  notificationIo = new Server(server, {
    path: '/api/socket.io',
    transports: ['websocket'],
    cors: { origin: true, credentials: true },
  })
  notificationIo.use(async (socket, next) => {
    try {
      const payload = jwt.verify(socket.handshake.auth?.token || '', env.jwtSecret)
      if (!payload.sid) return next(new Error('Secure session required.'))
      const user = await User.findById(payload.sub).select('role isActive sessions')
      const session = user?.sessions?.find((item) => item.sessionId === payload.sid)
      if (!user?.isActive || !session || session.loggedOutAt) return next(new Error('Session unavailable.'))
      const context = payload.context === 'admin' && ['admin', 'staff'].includes(user.role) ? 'admin' : 'storefront'
      socket.data = { userId: user.id, role: user.role, context }
      socket.join(context === 'admin' ? 'notifications:admin' : `notifications:user:${user.id}`)
      next()
    } catch { next(new Error('Authentication failed.')) }
  })
  notificationIo.on('connection', (socket) => {
    void sendState(socket).catch(() => {})
    socket.on('notifications:sync', () => { void sendState(socket).catch(() => {}) })
    socket.on('notifications:read', async (id) => {
      await Notification.findOneAndUpdate({ _id: id, ...filterFor(socket) }, { isRead: true })
      await sendState(socket)
    })
    socket.on('notifications:read-all', async () => {
      await Notification.updateMany(filterFor(socket), { isRead: true })
      await sendState(socket)
    })
  })
  return notificationIo
}

export function emitNotification(notification) {
  if (!notificationIo) return
  const room = notification.recipientRole === 'admin' ? 'notifications:admin' : `notifications:user:${notification.user}`
  notificationIo.to(room).emit('notification:new', notification)
}
