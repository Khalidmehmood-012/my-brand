import webpush from 'web-push'
import Notification from '../models/Notification.js'
import PushSubscription from '../models/PushSubscription.js'
import { env } from '../config/env.js'
import { emitNotification } from '../realtime/notificationSocket.js'

if (env.vapidPublicKey && env.vapidPrivateKey) webpush.setVapidDetails(env.vapidSubject, env.vapidPublicKey, env.vapidPrivateKey)

async function sendBrowserPush(notification) {
  if (!env.vapidPublicKey || !env.vapidPrivateKey) return
  const query = notification.recipientRole === 'admin' ? { context: 'admin' } : { context: 'storefront', user: notification.user }
  const subscriptions = await PushSubscription.find(query).populate('user', 'role isActive')
  const payload = JSON.stringify({ title: notification.title, message: notification.message, link: notification.link || '/', type: notification.type })
  await Promise.allSettled(subscriptions.map(async (subscription) => {
    if (!subscription.user?.isActive || (subscription.context === 'admin' && !['admin', 'staff'].includes(subscription.user.role))) return
    try {
      await webpush.sendNotification({ endpoint: subscription.endpoint, keys: subscription.keys }, payload)
    } catch (error) {
      if ([404, 410].includes(error.statusCode)) await PushSubscription.deleteOne({ _id: subscription.id })
    }
  }))
}

export async function createNotification(input) {
  const notification = await Notification.create(input)
  emitNotification(notification.toJSON())
  void sendBrowserPush(notification).catch(() => {})
  return notification
}
