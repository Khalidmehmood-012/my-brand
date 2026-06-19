import Link from 'next/link'

export default function PromoSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Promo 1 — Flat 30% Off */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-900 h-64">
          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-r from-black to-gray-800" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-start justify-center px-8 text-white">
            <span className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              Limited Time
            </span>
            <h3 className="text-3xl font-bold uppercase mb-1">
              Flat 30% Off
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              On selected T-Shirts & Hoodies
            </p>
            <Link
              href="/sale"
              className="bg-white text-black text-sm font-bold px-6 py-2 rounded-xl hover:bg-gray-200 transition uppercase tracking-widest"
            >
              Shop Sale
            </Link>
          </div>
        </div>

        {/* Promo 2 — Flat 40% Off */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-900 h-64">
          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-r from-gray-800 to-black" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-start justify-center px-8 text-white">
            <span className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              Mega Sale
            </span>
            <h3 className="text-3xl font-bold uppercase mb-1">
              Flat 40% Off
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              On selected Accessories
            </p>
            <Link
              href="/sale"
              className="bg-white text-black text-sm font-bold px-6 py-2 rounded-xl hover:bg-gray-200 transition uppercase tracking-widest"
            >
              Shop Sale
            </Link>
          </div>
        </div>

      </div>

    </section>
  )
}