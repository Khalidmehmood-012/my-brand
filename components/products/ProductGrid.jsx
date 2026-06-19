import ProductCard from '@/components/products/ProductCard'

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-gray-400 text-sm">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}