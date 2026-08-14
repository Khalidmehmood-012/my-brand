'use client'

import { useState } from 'react'
import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'
import CustomOrder from '@/components/products/CustomOrder'  // ← NAYA IMPORT
import useProducts from '@/lib/useProducts'
import usePublicConfig from '@/lib/usePublicConfig'

export default function CollectionPage({ params }) {
  const { products } = useProducts()
  const { categories: apiCategories } = usePublicConfig()
  const { category } = use(params)
  const gender = useSearchParams().get('gender')
  const requestedSubcategory = useSearchParams().get('subcategory')
  const [selectedSub, setSelectedSub] = useState(requestedSubcategory || 'All')

  const categoryNames = {
    tshirts: 'T-Shirts',
    hoodies: 'Hoodies',
    accessories: 'Accessories',
  }

  const categoryLabel = categoryNames[category] || category

  const apiCategory = apiCategories.find((item) => item.slug === (category.startsWith('women-') ? category.replace('women-', '') : category))
  const subcategories = ['All', ...(apiCategory?.subcategories || [])]

 const filtered = products.filter((p) => {
  const actualCategory = category === 'women-tshirts' ? 'tshirts' : category === 'women-hoodies' ? 'hoodies' : category
  const requestedGender = category.startsWith('women-') ? 'women' : gender || (['tshirts', 'hoodies'].includes(category) ? 'men' : '')
  const categoryMatch = p.category === actualCategory && (!requestedGender || p.gender === requestedGender || p.gender === 'unisex')
  const normalizeSub = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/s$/, '')
  const subMatch = selectedSub === 'All' || normalizeSub(p.subcategory) === normalizeSub(selectedSub)
  return categoryMatch && subMatch
})

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Heading — Center */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-black">
            {categoryLabel}
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            <span className="font-black text-black">{filtered.length}</span> Products
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-6" />

        {/* Subcategory Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 justify-center flex-wrap">
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSub(sub)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                selectedSub === sub
                  ? 'bg-black text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">😕</p>
            <p className="text-black font-black text-2xl uppercase mb-2">No Products Found</p>
            <p className="text-gray-400 text-sm">Try a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Custom order section is available for the T-Shirts category only. */}
        {category === 'tshirts' && <CustomOrder />}

      </div>
    </div>
  )
}
