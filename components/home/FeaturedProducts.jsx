import ProductGrid from '@/components/products/ProductGrid'
import products from '@/data/products'
import Link from 'next/link'

export default function FeaturedProducts() {
  // Sirf pehle 4 products dikhao
  const featured = products.slice(0, 4)

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">

      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-widest">
          Most Popular Picks
        </h2>
        <Link
          href="/shop"
          className="text-sm font-semibold underline hover:text-gray-500 transition"
        >
          View All
        </Link>
      </div>

      {/* Products Grid */}
      <ProductGrid products={featured} />

    </section>
  )
}