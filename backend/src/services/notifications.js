import Notification from '../models/Notification.js'

const listeners = new Set()

export function subscribeNotifications(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export async function createNotification(input) {
  const notification = await Notification.create(input)
  const data = notification.toJSON()
  listeners.forEach((listener) => listener(data))
  return notification
}
