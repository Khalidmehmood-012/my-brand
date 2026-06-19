import { create } from 'zustand'

const useCartStore = create((set) => ({
  items: [],

  addItem: (product, selectedSize) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.id === product.id && i.selectedSize === selectedSize
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id && i.selectedSize === selectedSize
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return {
        items: [
          ...state.items,
          { ...product, selectedSize, quantity: 1 },
        ],
      }
    }),

  removeItem: (id, selectedSize) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.id === id && i.selectedSize === selectedSize)
      ),
    })),

  increaseQty: (id, selectedSize) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id && i.selectedSize === selectedSize
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ),
    })),

  decreaseQty: (id, selectedSize) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id && i.selectedSize === selectedSize && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i
      ),
    })),

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    const state = useCartStore.getState()
    return state.items.reduce((total, i) => total + i.quantity, 0)
  },

  getTotalPrice: () => {
    const state = useCartStore.getState()
    return state.items.reduce(
      (total, i) => total + i.price * i.quantity,
      0
    )
  },
}))

export default useCartStore