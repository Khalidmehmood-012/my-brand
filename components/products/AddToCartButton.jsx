'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useCartStore from '@/lib/store'

export default function AddToCartButton({ product, selectedSize }) {
  const addItem = useCartStore((state) => state.addItem)
  const router = useRouter()
  const [added, setAdded] = useState(false)
  const soldOut = Number(product.stock) <= 0

  const handleAddToCart = () => {
    if (!selectedSize || soldOut) return
    addItem(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedSize || soldOut}
        className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition ${
          added
            ? 'bg-green-500 text-white'
            : selectedSize && !soldOut
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {added ? '✓ Added to Cart!' : soldOut ? 'Sold Out' : !selectedSize ? 'Select a Size' : 'Add to Cart 🛒'}
      </button>

      {/* Buy Now */}
      <button
        onClick={() => {
          if (!selectedSize || soldOut) return
          addItem(product, selectedSize)
          router.push('/cart')
        }}
        disabled={!selectedSize || soldOut}
        className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest border transition ${
          selectedSize && !soldOut
            ? 'border-black text-black hover:bg-gray-100'
            : 'border-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Buy Now ⚡
      </button>
      {product.stock > 0 && product.stock <= 5 && <p className="text-center text-xs font-bold text-red-600">Only {product.stock} left in stock</p>}
    </div>
  )
}
