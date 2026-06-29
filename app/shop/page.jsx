'use client'

import { useState } from 'react'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilter from '@/components/products/ProductFilter'
import Breadcrumb from '@/components/ui/Breadcrumb'
import products from '@/data/products'
import Link from 'next/link'

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
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
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop' },
          ]}
        />

        {/* Hero Section */}
        <div className="relative bg-black rounded-3xl overflow-hidden mt-4 mb-10">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=300&fit=crop"
              alt="Shop"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />
          </div>
          
          <div className="relative px-6 md:px-12 py-10 md:py-14">
            <div className="max-w-2xl">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-white/40 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 mb-3">
                Explore Our Collection
              </span>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
                All <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-300 to-white">Products</span>
              </h1>
              <p className="text-white/50 text-sm mt-2">
                {filtered.length} products found
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Filter Sidebar */}
          <div className="w-full md:w-56 shrink-0">
            <ProductFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
              <p className="text-sm font-bold text-black">
                {filtered.length} Products Found
              </p>
              <span className="text-xs text-gray-400 uppercase tracking-widest">
                {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 border-2 border-gray-200 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <p className="text-black font-bold text-xl uppercase mb-2">No Products Found</p>
                <p className="text-gray-400 text-sm">Try changing your filters</p>
              </div>
            ) : (
              <ProductGrid products={filtered} />
            )}
          </div>

        </div>
      </div>
    </div>
  )
}