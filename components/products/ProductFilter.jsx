'use client'

export default function ProductFilter({
  selectedCategory,
  setSelectedCategory,
  selectedSize,
  setSelectedSize,
}) {
  const categories = [
    { label: 'All', value: 'all' },
    { label: 'T-Shirts', value: 'tshirts' },
    { label: 'Hoodies', value: 'hoodies' },
    { label: 'Accessories', value: 'accessories' },
  ]

  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

  return (
    <div className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-100">
      
      {/* Category */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-xs font-black uppercase tracking-widest text-gray-400 w-full sm:w-auto">
          Category
        </span>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                selectedCategory === cat.value
                  ? 'bg-black text-white shadow-lg scale-105'
                  : 'bg-white text-gray-500 hover:bg-gray-200 hover:text-black border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 my-4" />

      {/* Size */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-black uppercase tracking-widest text-gray-400 w-full sm:w-auto">
          Size
        </span>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-9 h-9 rounded-full text-xs font-bold uppercase transition-all duration-200 ${
                selectedSize === size
                  ? 'bg-black text-white shadow-lg scale-105'
                  : 'bg-white text-gray-500 hover:bg-gray-200 hover:text-black border border-gray-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setSelectedCategory('all')
          setSelectedSize('All')
        }}
        className="w-full mt-5 text-xs font-bold uppercase tracking-widest text-gray-400  transition-colors py-2.5 border border-gray-200 rounded-xl hover:border-black hover:bg-black hover:text-white"
      >
        Clear All Filters
      </button>

    </div>
  )
}