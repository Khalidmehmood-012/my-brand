import { API_URL } from './backend'
import { getCustomerToken } from './authStore'

const decodeKey = (value) => {
  const padding = '='.repeat((4 - value.length % 4) % 4)
  const raw = atob((value + padding).replaceAll('-', '+').replaceAll('_', '/'))
  return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)))
}

export async function enableCustomerPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) throw new Error('Browser notifications are not supported on this device.')
  if (!window.isSecureContext) throw new Error('Browser notifications require HTTPS or localhost.')
  if (Notification.permission === 'denied') throw new Error('Notifications are blocked. Open the site settings from the address bar, set Notifications to Allow, then try again.')
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error('Permission was not granted. Select Allow in the browser notification prompt.')
  await navigator.serviceWorker.register('/notification-sw.js')
  const registration = await navigator.serviceWorker.ready
  const keyResponse = await fetch(`${API_URL}/notifications/push/public-key`)
  if (!keyResponse.ok) throw new Error('Unable to load notification configuration from the server.')
  const { data } = await keyResponse.json()
  if (!data?.configured) throw new Error('Browser notifications are not configured on the server.')
  const subscription = await registration.pushManager.getSubscription() || await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(data.publicKey) })
  const response = await fetch(`${API_URL}/notifications/push/subscribe`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCustomerToken()}` }, body: JSON.stringify(subscription.toJSON()) })
  if (!response.ok) throw new Error('Unable to save notification permission.')
  return true
}
