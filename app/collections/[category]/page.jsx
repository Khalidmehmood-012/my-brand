'use client'

import { useState } from 'react'
import { use } from 'react'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilter from '@/components/products/ProductFilter'
import Breadcrumb from '@/components/ui/Breadcrumb'
import products from '@/data/products'

export default function CollectionPage({ params }) {
  const { category } = use(params)
  const [selectedCategory, setSelectedCategory] = useState(category)
  const [selectedSize, setSelectedSize] = useState('All')

  // Filter products
  const filtered = products.filter((p) => {
    const categoryMatch =
      selectedCategory === 'all' || p.category === selectedCategory
    const sizeMatch =
      selectedSize === 'All' || p.sizes.includes(selectedSize)
    return categoryMatch && sizeMatch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Collections', href: '/shop' },
          { label: category.charAt(0).toUpperCase() + category.slice(1) },
        ]}
      />

      {/* Heading */}
      <h1 className="text-3xl font-bold uppercase tracking-widest mb-8">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Filter Sidebar */}
        <div className="w-full md:w-48 -shrink-0">
          <ProductFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
        </div>

        {/* Products */}
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-4">
            {filtered.length} products found
          </p>
          <ProductGrid products={filtered} />
        </div>

      </div>
    </div>
  )
}