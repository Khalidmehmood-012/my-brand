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

  const sizes = ['All', 'S', 'M', 'L', 'XL']

  return (
    <div className="flex flex-col gap-6">

      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-3">
          Category
        </h3>
        <ul className="flex flex-col gap-2">
          {categories.map((cat) => (
            <li key={cat.value}>
              <button
                onClick={() => setSelectedCategory(cat.value)}
                className={`text-sm transition ${
                  selectedCategory === cat.value
                    ? 'font-bold text-black'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Size Filter */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-3">
          Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-10 h-10 border rounded-lg text-sm font-semibold transition ${
                selectedSize === size
                  ? 'bg-black text-white border-black'
                  : 'text-gray-500 border-gray-300 hover:border-black hover:text-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}