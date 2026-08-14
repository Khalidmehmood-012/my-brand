'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useWishlistStore = create(persist((set, get) => ({
  items: [],
  has: (id) => get().items.some((item) => item.id === id),
  toggle: (product) => set((state) => ({ items: state.items.some((item) => item.id === product.id) ? state.items.filter((item) => item.id !== product.id) : [...state.items, product] })),
  remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  clear: () => set({ items: [] }),
}), { name: 'komrez-wishlist' }))

export default useWishlistStore
