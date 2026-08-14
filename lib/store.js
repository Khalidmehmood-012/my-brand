import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { API_URL, normalizeProduct } from './backend'
import { getCustomerToken } from './authStore'
import { toast } from '@/components/ui/ToastProvider'

async function cartApi(path = '', options = {}) {
  const token = getCustomerToken()
  if (!token) return null
  const response = await fetch(`${API_URL}/cart${path}`, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers } })
  if (!response.ok) throw new Error('Cart could not be synced.')
  return response.json()
}

function serverItems(cart) {
  return (cart?.items || []).filter((item) => item.product).map((item) => ({ ...normalizeProduct(item.product), selectedSize: item.selectedSize, quantity: item.quantity }))
}

const useCartStore = create(persist((set, get) => ({
  items: [], syncError: '',
  syncToServer: async () => {
    if (!getCustomerToken()) return
    try {
      await cartApi('', { method: 'PUT', body: JSON.stringify({ items: get().items.filter((item) => !item.isCustom && /^[a-f\d]{24}$/i.test(String(item.id))).map((item) => ({ productId: item.id, selectedSize: item.selectedSize || '', quantity: item.quantity })) }) })
      set({ syncError: '' })
    } catch (error) { set({ syncError: error.message }) }
  },
  loadServerCart: async () => {
    try { const payload = await cartApi(); if (payload) set({ items: serverItems(payload.data), syncError: '' }) } catch (error) { set({ syncError: error.message }) }
  },
  syncAfterLogin: async () => {
    if (get().items.length) await get().syncToServer()
    else await get().loadServerCart()
  },
  addItem: (product, selectedSize) => {
    const existingItem = get().items.find((item) => item.id === product.id && item.selectedSize === selectedSize)
    const parsedLimit = Number(product.stock)
    if (Number.isFinite(parsedLimit) && (parsedLimit <= 0 || (existingItem && existingItem.quantity >= parsedLimit))) { toast('warning', `Only ${parsedLimit} unit${parsedLimit === 1 ? '' : 's'} are available.`, 'Stock limit reached'); return false }
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id && item.selectedSize === selectedSize)
      const parsedStock = Number(product.stock), limit = Number.isFinite(parsedStock) ? parsedStock : Number.POSITIVE_INFINITY
      if (limit <= 0 || (existing && existing.quantity >= limit)) return state
      return { items: existing ? state.items.map((item) => item === existing ? { ...item, quantity: Math.min(item.quantity + 1, limit) } : item) : [...state.items, { ...product, selectedSize, quantity: 1 }] }
    }); void get().syncToServer(); return true
  },
  removeItem: (id, selectedSize) => { set((state) => ({ items: state.items.filter((item) => !(item.id === id && item.selectedSize === selectedSize)) })); void get().syncToServer() },
  increaseQty: (id, selectedSize) => { const item = get().items.find((entry) => entry.id === id && entry.selectedSize === selectedSize); const parsedStock = Number(item?.stock); if (item && Number.isFinite(parsedStock) && item.quantity >= parsedStock) { toast('warning', `Only ${parsedStock} unit${parsedStock === 1 ? '' : 's'} are available for this product.`, 'Stock limit reached'); return } set((state) => ({ items: state.items.map((entry) => entry.id === id && entry.selectedSize === selectedSize ? { ...entry, quantity: entry.quantity + 1 } : entry) })); void get().syncToServer() },
  decreaseQty: (id, selectedSize) => { set((state) => ({ items: state.items.map((item) => item.id === id && item.selectedSize === selectedSize && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item) })); void get().syncToServer() },
  clearCart: () => { set({ items: [] }); void cartApi('', { method: 'DELETE' }).catch(() => {}) },
  getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}), { name: 'cart-storage' }))

export default useCartStore
