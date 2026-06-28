'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductGrid from '@/components/products/ProductGrid'
import Breadcrumb from '@/components/ui/Breadcrumb'
import products from '@/data/products'
import Link from 'next/link'
import { Suspense } from 'react'

function SaleContent() {
  const searchParams = useSearchParams()
  const discountParam = searchParams.get('discount')
  
  const [selectedDiscount, setSelectedDiscount] = useState(discountParam || 'all')

  // URL se discount param mile to filter set karein
  useEffect(() => {
    if (discountParam) {
      setSelectedDiscount(discountParam)
    }
  }, [discountParam])

  // Sirf wo products jo sale pe hain
  const saleProducts = products.filter(
    (p) => p.originalPrice > p.price
  )

  // Discount filter
  const filteredProducts = saleProducts.filter((p) => {
    if (selectedDiscount === 'all') return true
    const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    return discount >= parseInt(selectedDiscount)
  })

  // Get discount label for display
  const getDiscountLabel = () => {
    if (selectedDiscount === 'all') return 'All Sale Items'
    return `${selectedDiscount}% Off`
  }

  // Count products by category for stats
  const menCount = filteredProducts.filter(p => p.category === 'tshirts' || p.category === 'hoodies').length
  const womenCount = filteredProducts.filter(p => p.category === 'accessories').length

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Sale' },
          ]}
        />

        {/* Hero Section */}
        <div className="relative bg-black rounded-3xl overflow-hidden mt-4 mb-12">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop"
              alt="Sale"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />
          </div>
          
          <div className="relative px-6 md:px-12 py-12 md:py-16">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-block mb-4 px-4 py-1.5 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-full">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
                  {selectedDiscount === 'all' ? 'All Sale Items' : `Flat ${selectedDiscount}% Off`}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white">
                Summer <span className="text-red-500">Sale</span>
              </h1>
              
              <p className="text-white/60 text-sm mt-3 max-w-md">
                {selectedDiscount === 'all' 
                  ? 'All sale items - grab them before they\'re gone!' 
                  : `Shop ${selectedDiscount}% off on selected items!`}
              </p>

              <div className="flex items-center gap-6 mt-6">
                <div>
                  <p className="text-2xl font-black text-white">
                    {selectedDiscount === 'all' ? 'Up to 50%' : `${selectedDiscount}%`}
                  </p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Off</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="text-2xl font-black text-white">{filteredProducts.length}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Products</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="text-2xl font-black text-white">Free</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Shipping</p>
                </div>
              </div>

              {/* Category Stats */}
              <div className="flex gap-4 mt-4">
                {menCount > 0 && (
                  <span className="text-[10px] text-white/40 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
                    👤 Men: {menCount}
                  </span>
                )}
                {womenCount > 0 && (
                  <span className="text-[10px] text-white/40 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
                    👤 Women: {womenCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {[
            { value: 'all', label: 'All Sale' },
            { value: '30', label: '30% Off' },
            { value: '40', label: '40% Off' },
          ].map((discount) => (
            <Link
              key={discount.value}
              href={`/sale?discount=${discount.value}`}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border-2 transition-all duration-300 ${
                selectedDiscount === discount.value
                  ? 'bg-black text-white border-black shadow-lg scale-105'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black hover:bg-gray-50'
              }`}
            >
              {discount.label}
            </Link>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
          <p className="text-sm font-bold text-black">
            {filteredProducts.length} Products Found
          </p>
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            {getDiscountLabel()}
          </span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 border-2 border-gray-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p className="text-black font-bold text-xl uppercase mb-2">No Sale Products</p>
            <p className="text-gray-400 text-sm">Try a different filter</p>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}

        {/* Bottom CTA */}
        <div className="mt-16 bg-gray-100 rounded-3xl p-8 md:p-12 text-center border-2 border-gray-200">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-2">
            Don't Miss Out
          </p>
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black mb-3">
            Sale Ends Soon!
          </h3>
          <p className="text-gray-500 text-sm mb-4">Subscribe to get notified about new deals</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-black text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 hover:scale-105"
          >
            <span>Shop Now</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default function SalePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SaleContent />
    </Suspense>
  )
}