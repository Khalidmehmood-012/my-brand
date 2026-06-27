import Link from 'next/link'

export default function CategoryGrid() {
  const genders = [
    {
      id: '1',
      name: 'Women',
      slug: 'women-tshirts',
      image: '/images/banners/women.jpg',
      description: 'Explore Women Collection',
    },
    {
      id: '2',
      name: 'Men',
      slug: 'tshirts',
      image: '/images/banners/men.jpg',
      description: 'Explore Men Collection',
    },
  ]

  const categories = [
    {
      id: '3',
      name: 'T-Shirts',
      slug: 'tshirts',
      image: '/images/banners/tshirts.jpg',
    },
    {
      id: '4',
      name: 'Hoodies',
      slug: 'hoodies',
      image: '/images/banners/hoodies.jpg',
    },
    {
      id: '5',
      name: 'Accessories',
      slug: 'accessories',
      image: '/images/banners/accessories.jpg',
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">

      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-black">
          Shop By Gender
        </h2>
        <p className="text-gray-400 text-sm mt-2">Find your perfect style</p>
      </div>

      {/* Women & Men — 2 Big Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {genders.map((gender) => (
          <Link
            key={gender.id}
            href={`/collections/${gender.slug}`}
            className="group relative rounded-3xl overflow-hidden bg-black border-2 border-black hover:shadow-2xl transition-all duration-300 h-80"
          >
            <img
              src={gender.image}
              alt={gender.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2">
                {gender.name}
              </h3>
              <p className="text-gray-300 text-sm mb-4">{gender.description}</p>
              <span className="inline-block text-xs font-black uppercase tracking-widest border-2 border-white text-white px-6 py-2 rounded-full group-hover:bg-white group-hover:text-black transition-all duration-300">
                Shop Now →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Categories — 3 Small Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/collections/${category.slug}`}
            className="group relative rounded-2xl overflow-hidden bg-black border border-gray-200 hover:shadow-xl transition-all duration-300 h-48"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h3 className="text-2xl font-black uppercase tracking-widest">
                {category.name}
              </h3>
              <span className="mt-2 text-xs font-bold uppercase tracking-widest border border-white px-4 py-1 rounded-full group-hover:bg-white group-hover:text-black transition-all duration-300">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>

    </section>
  )
}