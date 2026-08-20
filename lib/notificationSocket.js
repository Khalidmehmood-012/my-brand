import { io } from 'socket.io-client'
import { API_URL } from './backend'

export function createNotificationSocket(token) {
  // WebSocket upgrades must go directly to the API server. The `/backend-api`
  // Next.js rewrite is only used by HTTP requests and cannot reliably proxy the
  // Socket.IO upgrade in development.
  const explicitUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://komrez.fleximagepro.com'
  const explicitPath = process.env.NEXT_PUBLIC_SOCKET_PATH
  if (explicitUrl) return io(explicitUrl, { path: explicitPath || '/api/socket.io', transports: ['websocket'], auth: { token } })
  if (API_URL.startsWith('/')) return io(window.location.origin, { path: '/api/socket.io', transports: ['websocket'], auth: { token } })
  const url = new URL(API_URL)
  return io(url.origin, { path: `${url.pathname.replace(/\/$/, '')}/socket.io`, transports: ['websocket'], auth: { token } })
}
