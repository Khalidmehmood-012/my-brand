'use client'

import { useState } from 'react'
import { use } from 'react'
import { notFound } from 'next/navigation'
import products from '@/data/products'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Badge from '@/components/ui/Badge'
import SizeSelector from '@/components/products/SizeSelector'
import AddToCartButton from '@/components/products/AddToCartButton'
import ProductImageGallery from '@/components/products/ProductImageGallery'
import ProductGrid from '@/components/products/ProductGrid'

export default function ProductDetailPage({ params }) {
  const { slug } = use(params)
  const product = products.find((p) => p.slug === slug)

  const [selectedSize, setSelectedSize] = useState(null)

  if (!product) return notFound()

  // Related products (same category, exclude current)
  const related = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  )

  // Use same image multiple times for gallery (real app mein multiple images hongi)
  const images = [product.image, product.image, product.image]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: product.name },
        ]}
      />

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">

        {/* Left — Image Gallery */}
        <ProductImageGallery images={images} name={product.name} />

        {/* Right — Product Info */}
        <div className="flex flex-col gap-5">

          {/* Badge */}
          {product.badge && <Badge text={product.badge} />}

          {/* Name */}
          <h1 className="text-3xl font-bold uppercase tracking-wide">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">Rs. {product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-lg">
                Rs. {product.originalPrice}
              </span>
            )}
            {product.originalPrice > product.price && (
              <span className="text-red-500 text-sm font-bold">
                {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )}
                % OFF
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed">
            {product.description}
          </p>

          <hr />

          {/* Size Selector */}
          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />

          {/* Add to Cart + Buy Now */}
          <AddToCartButton
            product={product}
            selectedSize={selectedSize}
          />

          {/* Extra Info */}
          <div className="flex flex-col gap-2 text-sm text-gray-400 mt-2">
            <p>✅ Free shipping on orders above Rs. 2000</p>
            <p>🔄 Easy return & exchange within 7 days</p>
            <p>📦 Delivery in 3-5 working days</p>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-6">
            You May Also Like
          </h2>
          <ProductGrid products={related} />
        </div>
      )}

    </div>
  )
}