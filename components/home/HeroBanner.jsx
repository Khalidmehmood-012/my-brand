// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import banners from '@/data/banners'

// export default function HeroBanner() {
//   const [current, setCurrent] = useState(0)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % banners.length)
//     }, 4000)
//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-black">

//       {/* Slides */}
//       {banners.map((banner, index) => (
//         <div
//           key={banner.id}
//           className={`absolute inset-0 transition-opacity duration-700 ${
//             index === current ? 'opacity-100' : 'opacity-0'
//           }`}
//           style={{
//             backgroundImage: `url(${banner.image})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundRepeat: 'no-repeat',
//           }}
//         >
//           {/* Overlay */}
//           <div className="absolute inset-0 bg-black/40" />
          
//           {/* Content */}
//           <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
//             <p className="text-sm uppercase tracking-widest mb-2 text-gray-300">
//               {banner.subtitle}
//             </p>
//             <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 uppercase tracking-wide max-w-4xl">
//               {banner.title}
//             </h1>
//             <Link
//               href={banner.buttonLink}
//               className="bg-white text-black px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition transform hover:scale-105 duration-200"
//             >
//               {banner.buttonText}
//             </Link>
//           </div>
//         </div>
//       ))}

//       {/* Dots */}
//       <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
//         {banners.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrent(index)}
//             className={`h-2 rounded-full transition-all duration-300 ${
//               index === current ? 'bg-white w-6' : 'bg-white/50 w-2'
//             }`}
//           />
//         ))}
//       </div>

//       {/* Prev Arrow */}
//       <button
//         onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
//         className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 text-black rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
//         </svg>
//       </button>

//       {/* Next Arrow */}
//       <button
//         onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
//         className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 text-black rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
//         </svg>
//       </button>

//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import banners from '@/data/banners'

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Scroll to CategoryGrid function
  const handleShopNowClick = (e) => {
    e.preventDefault()
    const categorySection = document.getElementById('category-grid')
    if (categorySection) {
      categorySection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <div className="relative w-full h-125 md:h-150 lg:h-175 overflow-hidden bg-black">

      {/* Slides */}
      {banners.map((banner, index) => {
        // Check if this is the Sale slide
        const isSaleSlide = banner.title?.toLowerCase().includes('summer sale')
        
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image with Parallax */}
            <div 
              className="absolute inset-0 transition-transform duration-8000ms ease-out"
              style={{
                backgroundImage: `url(${banner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transform: index === current ? 'scale(1.05)' : 'scale(1)',
              }}
            />

            {/* Overlay Layers */}
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            
            {/* Diagonal Accent Line */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="absolute top-0 right-[30%] w-1 h-full bg-white/10 transform -skew-x-12" />
            </div>

            {/* Content - Split Layout */}
            <div className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24">
              
              {/* Left Side - Main Content */}
              <div className="max-w-2xl">
                {/* Animated Tag */}
                <div className={`transform transition-all duration-700 delay-100 ${
                  index === current ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/60 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    {banner.subtitle}
                  </span>
                </div>

                {/* Main Title with Gradient */}
                <h1 className={`transform transition-all duration-700 delay-200 ${
                  index === current ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                } text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05] mt-6`}>
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-white to-gray-400">
                    {banner.title}
                  </span>
                </h1>

                {/* Brand Line */}
                <div className={`flex items-center gap-4 mt-6 transform transition-all duration-700 delay-300 ${
                  index === current ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  <div className="w-12 h-0.5 bg-white/30" />
                  <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">
                    Premium Quality
                  </span>
                  <div className="w-12 h-0.5 bg-white/30" />
                </div>

                {/* Buttons - Different actions for different slides */}
                <div className={`flex flex-wrap gap-4 mt-8 transform transition-all duration-700 delay-400 ${
                  index === current ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  {isSaleSlide ? (
                    // Sale Slide → Goes to Sale Page
                    <Link
                      href="/sale"
                      className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-white text-black rounded-full font-bold text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 hover:pl-12 hover:pr-8"
                    >
                      <span className="relative z-10">{banner.buttonText}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      <span className="absolute inset-0 bg-gray-100 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    </Link>
                  ) : (
                    // New Collection Slide → Scroll to CategoryGrid
                    <button
                      onClick={handleShopNowClick}
                      className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-white text-black rounded-full font-bold text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 hover:pl-12 hover:pr-8 cursor-pointer"
                    >
                      <span className="relative z-10">{banner.buttonText}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      <span className="absolute inset-0 bg-gray-100 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    </button>
                  )}
                </div>

                {/* Stats */}
                <div className={`flex gap-8 mt-10 transform transition-all duration-700 delay-500 ${
                  index === current ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  <div>
                    <p className="text-2xl font-black text-white">50K+</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">Happy Customers</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <p className="text-2xl font-black text-white">4.9★</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">Rating</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Animated Number */}
              <div className="hidden lg:flex flex-1 justify-end">
                <div className={`transform transition-all duration-700 delay-300 ${
                  index === current ? 'scale-100 opacity-100' : 'scale-125 opacity-0'
                }`}>
                  <span className="text-[200px] font-black text-white/5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Navigation - Side Dots */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`group relative transition-all duration-300 ${
              index === current 
                ? 'w-10 h-10 bg-white/20 backdrop-blur-sm border-2 border-white' 
                : 'w-6 h-6 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20'
            } rounded-full flex items-center justify-center`}
          >
            <span className={`transition-all duration-300 ${
              index === current ? 'w-4 h-4 bg-white' : 'w-2 h-2 bg-white/30'
            } rounded-full`} />
            <span className="absolute right-full mr-4 text-[8px] text-white/0 group-hover:text-white/40 transition-all duration-300 whitespace-nowrap font-bold uppercase tracking-widest">
              {index === 0 ? 'New Collection' : index === 1 ? 'Summer Sale' : `Slide ${index + 1}`}
            </span>
          </button>
        ))}
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 z-20">
        <div 
          className="h-full bg-linear-to-r from-white via-white/50 to-transparent transition-all duration-6000ms ease-linear"
          style={{ width: `${((current + 1) / banners.length) * 100}%` }}
        />
      </div>

    </div>
  )
}