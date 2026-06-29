'use client'

import { useState } from 'react'
import Link from 'next/link'
import useCartStore from '@/lib/store'

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = () => {
    addItem(product, product.sizes[0])
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div 
      className="group relative rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - No white border */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Dark Overlay on Hover */}
          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />

          {/* Quick View on Hover */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}>
            <span className="bg-white text-black text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-300">
              Quick View
            </span>
          </div>

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-2 left-2">
              <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 md:px-3 md:py-1 rounded-full ${
                product.badge === 'SALE' 
                  ? 'bg-red-500 text-white' 
                  : product.badge === 'NEW IN'
                  ? 'bg-blue-500 text-white'
                  : 'bg-black text-white'
              }`}>
                {product.badge}
              </span>
            </div>
          )}

          {/* Discount Badge - Bottom Left */}
          {product.originalPrice > product.price && (
            <div className="absolute bottom-2 left-2">
              <span className="text-[8px] md:text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Info - No extra border */}
      <div className="p-2 md:p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-xs md:text-sm uppercase tracking-wide text-black hover:text-gray-500 transition-colors line-clamp-2 min-h-8 md:min-h-10">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2 flex-wrap">
          <p className="text-sm md:text-base font-bold text-black">Rs. {product.price}</p>
          {product.originalPrice > product.price && (
            <p className="text-[8px] md:text-xs text-gray-400 line-through">
              Rs. {product.originalPrice}
            </p>
          )}
        </div>

        {/* Buttons - With Cart Icon instead of Plus */}
        <div className="flex gap-1 md:gap-2 mt-2 md:mt-4">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-black text-white hover:bg-gray-800 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="hidden xs:inline">Added</span>
              </>
            ) : (
              <>
                {/* Cart Icon instead of Plus */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span className="hidden xs:inline">Add</span>
              </>
            )}
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 border-2 border-black text-black py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold uppercase tracking-wider text-center hover:bg-black hover:text-white transition-all duration-300"
          >
            <span className="hidden xs:inline">View</span>
            <span className="xs:hidden">View</span>
          </Link>
        </div>
      </div>

    </div>
  )
}