'use client'

export default function SizeSelector({ sizes, selectedSize, setSelectedSize }) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-widest mb-3">
        Select Size
      </h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`w-12 h-12 border rounded-xl text-sm font-semibold transition ${
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
  )
}