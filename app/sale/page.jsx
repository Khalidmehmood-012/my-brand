'use client'

import { useState } from 'react'
import ProductGrid from '@/components/products/ProductGrid'
import Breadcrumb from '@/components/ui/Breadcrumb'
import products from '@/data/products'

export default function SalePage() {
  const [selectedDiscount, setSelectedDiscount] = useState('all')

  // Sirf wo products jo sale pe hain
  const saleProducts = products.filter(
    (p) => p.originalPrice > p.price
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Sale' },
        ]}
      />

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">
          🔥 Summer Sale
        </h1>
        <p className="text-gray-400 text-sm">
          Limited time offers — Grab them before they're gone!
        </p>
      </div>

      {/* Discount Filter Buttons */}
      <div className="flex gap-3 justify-center mb-10">
        {['all', '30', '40'].map((discount) => (
          <button
            key={discount}
            onClick={() => setSelectedDiscount(discount)}
            className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest border transition ${
              selectedDiscount === discount
                ? 'bg-black text-white border-black'
                : 'text-gray-500 border-gray-300 hover:border-black hover:text-black'
            }`}
          >
            {discount === 'all' ? 'All Sale' : `Flat ${discount}% Off`}
          </button>
        ))}
      </div>

      {/* Products */}
      <p className="text-sm text-gray-400 mb-4">
        {saleProducts.length} sale products found
      </p>
      <ProductGrid products={saleProducts} />

    </div>
  )
}