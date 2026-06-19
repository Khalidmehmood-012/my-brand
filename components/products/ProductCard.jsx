'use client'

import Image from 'next/image'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import useCartStore from '@/lib/store'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product, product.sizes[0])
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white">

      {/* Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-2 left-2">
              <Badge text={product.badge} />
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm hover:underline line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-bold">Rs. {product.price}</p>
          {product.originalPrice > product.price && (
            <p className="text-xs text-gray-400 line-through">
              Rs. {product.originalPrice}
            </p>
          )}
        </div>

        {/* Buttons */}
       <div className="flex gap-2 mt-3">
  <button
    onClick={handleAddToCart}
    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
      added
        ? 'bg-green-500 text-white'
        : 'bg-black text-white hover:bg-gray-800'
    }`}
  >
    {added ? '✓ Added!' : 'Add to Cart'}
  </button>
  <Link
    href={`/products/${product.slug}`}
    className="flex-1 border border-black text-black py-2 rounded-xl text-sm font-semibold text-center hover:bg-gray-50 transition"
  >
    View Product
  </Link>
</div>
      </div>

    </div>
  )
}