import Link from 'next/link'
import products from '@/data/products'
import ProductCard from '@/components/products/ProductCard'

export default function MenPage() {
  const categories = [
    {
      name: 'T-Shirts',
      slug: 'tshirts',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=400&fit=crop',
      count: products.filter((p) => p.category === 'tshirts').length,
    },
    {
      name: 'Hoodies',
      slug: 'hoodies',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop',
      count: products.filter((p) => p.category === 'hoodies').length,
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&h=400&fit=crop',
      count: products.filter((p) => p.category === 'accessories').length,
    },
  ]

  const featuredProducts = products.filter((p) =>
    ['tshirts', 'hoodies', 'accessories'].includes(p.category)
  ).slice(0, 4)

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Section - Modern Parallax */}
      <div className="relative h-112.5 md:h-137.5 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=800&fit=crop"
            alt="Men Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-block mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                ★ Premium Collection 2024
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight text-white leading-[1.05]">
              Men's
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
                Style
              </span>
            </h1>
            
            <p className="text-white/70 text-sm md:text-base mt-4 max-w-md leading-relaxed">
              Discover our premium collection of streetwear designed for the modern man. 
              Quality fabrics, timeless designs.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mt-8">
              <div>
                <p className="text-2xl font-black text-white">150+</p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Products</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">4.9★</p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Authentic</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white/30">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Shop By Category - Modern Cards with Hover Effect */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 bg-gray-100 px-4 py-2 rounded-full">
                Categories
              </span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-2">
                Shop by <span className="bg-linear-to-r from-black to-gray-600 bg-clip-text text-transparent">Category</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <Link
                key={cat.slug}
                href={`/collections/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    <span className="text-[10px] font-black text-white/80">{cat.count} items</span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-white">
                      {cat.name}
                    </h3>
                    <div className="mt-3 inline-flex items-center gap-2 text-white/70 group-hover:text-white transition-colors duration-300">
                      <span className="text-sm font-bold uppercase tracking-wider">Shop Now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products - Modern Grid */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 bg-gray-100 px-4 py-2 rounded-full">
                Best Sellers
              </span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-2">
                Featured for <span className="bg-linear-to-r from-black to-gray-600 bg-clip-text text-transparent">Men</span>
              </h2>
            </div>
            <Link
              href="/shop"
              className="group flex items-center gap-2 text-sm font-bold text-black hover:text-gray-500 transition-colors"
            >
              <span>View All</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-20 bg-black rounded-3xl p-10 md:p-16 text-center relative overflow-hidden group">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>
          
          <div className="relative">
            <span className="inline-block text-xs font-black uppercase tracking-[0.3em] text-white/40 bg-white/5 px-4 py-2 rounded-full mb-4">
              Limited Offer
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
              New Collection <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-400 to-white">Drops</span>
            </h3>
            <p className="text-white/50 text-sm mt-3 max-w-md mx-auto">
              Be the first to explore our latest arrivals. Exclusive designs, premium quality.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 mt-6 px-8 py-4 bg-white text-black rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
            >
              <span>Explore Now</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}