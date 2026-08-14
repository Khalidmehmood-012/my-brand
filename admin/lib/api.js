export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://komrez.fleximagepro.com/api'

export function getToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('komrez-admin-token')
}

export function setSession(token, user) {
  window.localStorage.setItem('komrez-admin-token', token)
  window.localStorage.setItem('komrez-admin-user', JSON.stringify(user))
}

export function clearSession() {
  window.localStorage.removeItem('komrez-admin-token')
  window.localStorage.removeItem('komrez-admin-user')
}

export async function api(path, options = {}) {
  const isFormData = options.body instanceof FormData
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload.error?.message || 'Request failed.')
    error.code = payload.error?.code
    error.status = response.status
    error.details = payload.error?.details
    throw error
  }
  return payload
}
