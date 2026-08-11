import ProductGrid from '@/components/products/ProductGrid'
import products from '@/data/products'
import Link from 'next/link'

export default function FeaturedProducts() {
  // Sirf pehle 4 products dikhao
  const featured = products.slice(0, 8)

  return (
    <section className="bg-stone-50 border-y border-stone-100">
      <div className="max-w-7xl mx-auto px-4 py-16">

      {/* Heading */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-2">Trending now</p>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-950">
          Most Popular Picks
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-sm font-bold border-b border-black pb-1 hover:text-gray-500 hover:border-gray-400 transition"
        >
          View All
        </Link>
      </div>

      {/* Products Grid */}
      <ProductGrid products={featured} />

      </div>
    </section>
  )
}
