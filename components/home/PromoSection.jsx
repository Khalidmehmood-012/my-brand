// import Link from 'next/link'

// export default function PromoSection() {
//   return (
//     <section className="max-w-7xl mx-auto px-4 py-12">

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//         {/* Promo 1 — Flat 30% Off */}
//         <div className="relative rounded-2xl overflow-hidden bg-gray-900 h-64">
//           {/* Background */}
//           <div className="absolute inset-0 bg-linear-to-r from-black to-gray-800" />

//           {/* Content */}
//           <div className="absolute inset-0 flex flex-col items-start justify-center px-8 text-white">
//             <span className="text-xs uppercase tracking-widest text-gray-400 mb-2">
//               Limited Time
//             </span>
//             <h3 className="text-3xl font-bold uppercase mb-1">
//               Flat 30% Off
//             </h3>
//             <p className="text-gray-300 text-sm mb-4">
//               On selected T-Shirts & Hoodies
//             </p>
//             <Link
//               href="/sale"
//               className="bg-white text-black text-sm font-bold px-6 py-2 rounded-xl hover:bg-gray-200 transition uppercase tracking-widest"
//             >
//               Shop Sale
//             </Link>
//           </div>
//         </div>

//         {/* Promo 2 — Flat 40% Off */}
//         <div className="relative rounded-2xl overflow-hidden bg-gray-900 h-64">
//           {/* Background */}
//           <div className="absolute inset-0 bg-linear-to-r from-gray-800 to-black" />

//           {/* Content */}
//           <div className="absolute inset-0 flex flex-col items-start justify-center px-8 text-white">
//             <span className="text-xs uppercase tracking-widest text-gray-400 mb-2">
//               Mega Sale
//             </span>
//             <h3 className="text-3xl font-bold uppercase mb-1">
//               Flat 40% Off
//             </h3>
//             <p className="text-gray-300 text-sm mb-4">
//               On selected Accessories
//             </p>
//             <Link
//               href="/sale"
//               className="bg-white text-black text-sm font-bold px-6 py-2 rounded-xl hover:bg-gray-200 transition uppercase tracking-widest"
//             >
//               Shop Sale
//             </Link>
//           </div>
//         </div>

//       </div>

//     </section>
//   )
// }

'use client'
import Link from 'next/link'

export default function PromoSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 bg-black">

      {/* Heading */}
      <div className="text-center mb-12">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          Exclusive Deals
        </span>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mt-3">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-300 to-white">Limited</span> Time Offers
        </h2>
        <p className="text-gray-500 text-sm mt-2">Grab your favorites before they're gone</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Promo 1 — Men's Collection */}
        <Link
          href="/sale?discount=30"
          className="group relative rounded-2xl overflow-hidden h-80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/5"
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a6?w=800&h=600&fit=crop&q=80"
              alt="Men Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop&q=80'
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />
          </div>

          {/* Decorative Line */}
          <div className="absolute top-0 left-0 w-1 h-20 bg-white/20" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl font-black text-red-500">30%</span>
              <span className="text-xs font-bold uppercase tracking-widest text-white/60">Off</span>
              <span className="ml-auto text-[10px] font-black uppercase tracking-[0.2em] text-white/40 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                Men
              </span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
              Streetwear <span className="text-red-400">Collection</span>
            </h3>
            <p className="text-white/50 text-sm">T-Shirts • Hoodies • Jackets</p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white group-hover:gap-4 transition-all duration-300 border-b-2 border-white/30 pb-1 group-hover:border-white">
              Shop Men's Sale
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Promo 2 — Women's Collection */}
        <Link
          href="/sale?discount=40"
          className="group relative rounded-2xl overflow-hidden h-80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/5"
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=600&fit=crop&q=80"
              alt="Women Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop&q=80'
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-l from-black/30 to-transparent" />
          </div>

          {/* Decorative Line */}
          <div className="absolute top-0 right-0 w-1 h-20 bg-white/20" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl font-black text-orange-500">40%</span>
              <span className="text-xs font-bold uppercase tracking-widest text-white/60">Off</span>
              <span className="ml-auto text-[10px] font-black uppercase tracking-[0.2em] text-white/40 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                Women
              </span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
              Lifestyle <span className="text-orange-400">Essentials</span>
            </h3>
            <p className="text-white/50 text-sm">Dresses • Tops • Accessories</p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white group-hover:gap-4 transition-all duration-300 border-b-2 border-white/30 pb-1 group-hover:border-white">
              Shop Women's Sale
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </Link>

      </div>

      {/* Bottom Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/5 hover:border-white/20 transition-all duration-300 group backdrop-blur-sm">
          <p className="text-3xl font-black text-white group-hover:scale-110 transition-transform">50K+</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Happy Customers</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/5 hover:border-white/20 transition-all duration-300 group backdrop-blur-sm">
          <p className="text-3xl font-black text-white group-hover:scale-110 transition-transform">4.9★</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Average Rating</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/5 hover:border-white/20 transition-all duration-300 group backdrop-blur-sm">
          <p className="text-3xl font-black text-white group-hover:scale-110 transition-transform">100%</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Authentic</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/5 hover:border-white/20 transition-all duration-300 group backdrop-blur-sm">
          <p className="text-3xl font-black text-white group-hover:scale-110 transition-transform">Free</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Shipping</p>
        </div>
      </div>

    </section>
  )
}