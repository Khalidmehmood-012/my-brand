const LIVE_API_URL = process.env.BACKEND_API_URL || 'https://komrez.fleximagepro.com/api'
export const API_URL = typeof window === 'undefined' ? LIVE_API_URL : (process.env.NEXT_PUBLIC_API_URL || '/backend-api')

export function normalizeProduct(product) {
  const image = product.image || product.images?.[0] || ''
  return { ...product, image, images: [...new Set([image, ...(product.images || [])].filter(Boolean))], id: product._id || product.id || product.legacyId }
}

export async function getProducts(query = '') {
  try {
    const response = await fetch(`${API_URL}/products?limit=100${query ? `&${query}` : ''}`, { cache: 'no-store' })
    if (!response.ok) return []
    const payload = await response.json()
    return payload.data.map(normalizeProduct)
  } catch {
    // API-down state must render an empty catalog instead of crashing the storefront.
    return []
  }
}

export async function backendRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload.error?.message || 'Unable to complete the request.')
    error.code = payload.error?.code
    error.details = payload.error?.details
    throw error
  }
  return payload
}
