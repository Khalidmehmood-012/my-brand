import Link from 'next/link'

export default function CategoryGrid() {
  const genders = [
    {
      id: '1',
      name: 'Women',
      slug: 'women',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop',
      description: 'Discover Elegance',
      color: 'from-pink-500/40',
    },
    {
      id: '2',
      name: 'Men',
      slug: 'men',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop',
      description: 'Define Your Style',
      color: 'from-blue-500/40',
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">

      {/* Heading with Animation - WHITE TEXT */}
      <div className="text-center mb-14">
        <div className="inline-block">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-300 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            Collection 2024
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mt-4 drop-shadow-lg">
          Choose Your <span className="text-white">Style</span>
        </h2>
        <p className="text-white/70 text-sm mt-3 max-w-md mx-auto drop-shadow-md">
          Find your perfect fit from our premium collections
        </p>
      </div>

      {/* Women & Men — Modern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {genders.map((gender, index) => (
          <Link
            key={gender.id}
            href={`/collections/${gender.slug}`}
            className={`group relative rounded-3xl overflow-hidden bg-black transform transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl ${
              index === 0 ? 'md:-translate-y-4' : 'md:translate-y-4'
            }`}
          >
            {/* Image with Zoom */}
            <div className="relative h-112.5 md:h-125 overflow-hidden">
              <img
                src={gender.image}
                alt={gender.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-linear-to-t ${gender.color} via-black/30 to-transparent`} />
              
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                {/* Badge */}
                <div className="inline-block mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    {index === 0 ? '✦ New Collection' : '★ Best Sellers'}
                  </span>
                </div>

                <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-3 drop-shadow-lg">
                  {gender.name}
                </h3>
                
                <p className="text-white/80 text-sm md:text-base mb-6 max-w-xs drop-shadow-md">
                  {gender.description}
                </p>

                {/* Animated Button */}
                <div className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-black rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:scale-105 hover:shadow-2xl">
                  <span>Shop Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
              <span className="text-white/60 text-xs font-bold uppercase tracking-wider bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                {index === 0 ? '150+ Styles' : '120+ Styles'}
              </span>
            </div>
          </Link>
        ))}
      </div>

    </section>
  )
}