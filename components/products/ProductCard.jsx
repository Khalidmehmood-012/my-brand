// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import useCartStore from '@/lib/store'

// export default function ProductCard({ product }) {
//   const addItem = useCartStore((state) => state.addItem)
//   const [added, setAdded] = useState(false)
//   const [isHovered, setIsHovered] = useState(false)

//   const handleAddToCart = () => {
//     addItem(product, product.sizes[0])
//     setAdded(true)
//     setTimeout(() => setAdded(false), 1500)
//   }

//   return (
//     <div 
//       className="group relative rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-lg"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Image Container - No white border */}
//       <Link href={`/products/${product.slug}`}>
//         <div className="relative aspect-square overflow-hidden bg-gray-100">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//           />
          
//           {/* Dark Overlay on Hover */}
//           <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
//             isHovered ? 'opacity-100' : 'opacity-0'
//           }`} />

//           {/* Quick View on Hover */}
//           <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
//             isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
//           }`}>
//             <span className="bg-white text-black text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-300">
//               Quick View
//             </span>
//           </div>

//           {/* Badge */}
//           {product.badge && (
//             <div className="absolute top-2 left-2">
//               <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 md:px-3 md:py-1 rounded-full ${
//                 product.badge === 'SALE' 
//                   ? 'bg-red-500 text-white' 
//                   : product.badge === 'NEW IN'
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-black text-white'
//               }`}>
//                 {product.badge}
//               </span>
//             </div>
//           )}

//           {/* Discount Badge - Bottom Left */}
//           {product.originalPrice > product.price && (
//             <div className="absolute bottom-2 left-2">
//               <span className="text-[8px] md:text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
//                 {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
//               </span>
//             </div>
//           )}
//         </div>
//       </Link>

//       {/* Info - No extra border */}
//       <div className="p-2 md:p-4">
//         <Link href={`/products/${product.slug}`}>
//           <h3 className="font-bold text-xs md:text-sm uppercase tracking-wide text-black hover:text-gray-500 transition-colors line-clamp-2 min-h-8 md:min-h-10">
//             {product.name}
//           </h3>
//         </Link>

//         {/* Price */}
//         <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2 flex-wrap">
//           <p className="text-sm md:text-base font-bold text-black">Rs. {product.price}</p>
//           {product.originalPrice > product.price && (
//             <p className="text-[8px] md:text-xs text-gray-400 line-through">
//               Rs. {product.originalPrice}
//             </p>
//           )}
//         </div>

//         {/* Buttons - With Cart Icon instead of Plus */}
//         <div className="flex gap-1 md:gap-2 mt-2 md:mt-4">
//           <button
//             onClick={handleAddToCart}
//             className={`flex-1 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 ${
//               added
//                 ? 'bg-green-500 text-white'
//                 : 'bg-black text-white hover:bg-gray-800 active:scale-95'
//             }`}
//           >
//             {added ? (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
//                 </svg>
//                 <span className="hidden xs:inline">Added</span>
//               </>
//             ) : (
//               <>
//                 {/* Cart Icon instead of Plus */}
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
//                 </svg>
//                 <span className="hidden xs:inline">Add</span>
//               </>
//             )}
//           </button>
//           <Link
//             href={`/products/${product.slug}`}
//             className="flex-1 border-2 border-black text-black py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold uppercase tracking-wider text-center hover:bg-black hover:text-white transition-all duration-300"
//           >
//             <span className="hidden xs:inline">View</span>
//             <span className="xs:hidden">View</span>
//           </Link>
//         </div>
//       </div>

//     </div>
//   )
// }


'use client'

import { useState } from 'react'
import Link from 'next/link'
import useCartStore from '@/lib/store'
import WishlistButton from './WishlistButton'
import { toast } from '@/components/ui/ToastProvider'
import QuickViewModal from './QuickViewModal'

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem)
  const cartItems = useCartStore((state) => state.items)
  const [isHovered, setIsHovered] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  // The first image is the primary view; the second is used on hover.
  const images = product.images || [product.image]
  const reserved = cartItems.filter((item) => item.id === product.id).reduce((sum, item) => sum + item.quantity, 0)
  const available = Math.max(0, Number(product.stock || 0) - reserved)
  const unavailable = available <= 0

  const handleAddToCart = () => {
    if (unavailable) return toast('warning', 'All available stock is already reserved in your cart.', 'Stock reserved')
    addItem(product, product.sizes?.[0] || 'One Size')
    toast('success', `${product.name} has been added to your cart.`, 'Added to cart')
  }
  return (
    <div 
      className="group relative rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="block h-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
        <div className="relative h-full">
          
          {/* Front Image */}
          <img
            src={images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered && images.length > 1 ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
            }`}
          />
          
          {/* Back/Model Image - Shows on Hover */}
          {images.length > 1 && (
            <img
              src={images[1] || images[0]}
              alt={`${product.name} - back view`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
            />
          )}

          {/* Dark Overlay on Hover */}
          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />

          {/* Quick View + Size Availability on Hover */}
          <div className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}>
            
            {/* Size Availability - Quick View */}
            <div className="flex flex-wrap gap-1.5 justify-center mt-1">
              {product.sizes?.slice(0, 5).map((size) => (
                <span 
                  key={size} 
                  className="text-[8px] font-bold text-white bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/30"
                >
                  {size}
                </span>
              ))}
              {product.sizes?.length > 5 && (
                <span className="text-[8px] font-bold text-white/60 bg-white/10 px-1.5 py-0.5 rounded-full">
                  +{product.sizes.length - 5}
                </span>
              )}
            </div>
          </div>

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-2 left-2">
              <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 md:px-3 md:py-1 rounded-full ${
                product.badge === 'SALE' 
                  ? 'bg-red-500 text-white' 
                  : product.badge === 'NEW IN'
                  ? 'bg-blue-500 text-white'
                  : 'bg-black text-white'
              }`}>
                {product.badge}
              </span>
            </div>
          )}
          {/* Discount Badge */}
          {product.originalPrice > product.price && (
            <div className="absolute bottom-2 left-2">
              <span className="text-[8px] md:text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </div>
          )}
        </div>
        </Link>
        <button type="button" onClick={() => setQuickViewOpen(true)} className={`absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-[9px] font-black uppercase tracking-widest text-black shadow-xl transition-all duration-300 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:px-5 md:py-2.5 md:text-xs ${isHovered ? 'md:scale-100 md:opacity-100' : 'md:pointer-events-none md:scale-90 md:opacity-0'}`}>Quick view</button>
        <WishlistButton product={product} compact className="absolute right-3 top-3 z-20 shadow-md" />
      </div>

      {/* Info */}
      <div className="p-2 md:p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-xs md:text-sm uppercase tracking-wide text-black hover:text-gray-500 transition-colors line-clamp-2 min-h-8 md:min-h-10">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2 flex-wrap">
          <p className="text-sm md:text-base font-bold text-black">Rs. {product.price}</p>
          {product.originalPrice > product.price && (
            <p className="text-[8px] md:text-xs text-gray-400 line-through">
              Rs. {product.originalPrice}
            </p>
          )}
        </div>
        {product.stock > 0 && product.stock <= 5 && <p className="mt-2 text-[10px] font-black uppercase text-red-600">Only {available} of {product.stock} left</p>}

        {/* Buttons */}
        <div className="flex gap-1 md:gap-2 mt-2 md:mt-4">
          {!unavailable ? <button
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-black py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-gray-800 active:scale-95 md:rounded-xl md:py-2.5 md:text-sm"
          >
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span className="hidden xs:inline">Add</span>
              </>
          </button> : <WishlistButton product={product} className="flex-1 rounded-lg! py-1.5! text-[10px] md:rounded-xl! md:py-2.5! md:text-xs" />}
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 border-2 border-black text-black py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold uppercase tracking-wider text-center hover:bg-black hover:text-white transition-all duration-300"
          >
            <span className="hidden xs:inline">View</span>
            <span className="xs:hidden">View</span>
          </Link>
        </div>
      </div>

      <QuickViewModal product={product} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />

    </div>
  )
}
