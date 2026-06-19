'use client'

import { useState } from 'react'
import useCartStore from '@/lib/store'

export default function AddToCartButton({ product, selectedSize }) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    if (!selectedSize) return
    addItem(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedSize}
        className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition ${
          added
            ? 'bg-green-500 text-white'
            : selectedSize
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {added ? '✓ Added to Cart!' : !selectedSize ? 'Select a Size' : 'Add to Cart 🛒'}
      </button>

      {/* Buy Now */}
      <button
        onClick={() => {
          if (!selectedSize) return
          addItem(product, selectedSize)
          window.location.href = '/cart'
        }}
        disabled={!selectedSize}
        className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest border transition ${
          selectedSize
            ? 'border-black text-black hover:bg-gray-100'
            : 'border-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Buy Now ⚡
      </button>
    </div>
  )
}