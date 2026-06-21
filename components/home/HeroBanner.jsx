'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import banners from '@/data/banners'

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900">

      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <p className="text-sm uppercase tracking-widest mb-2 text-gray-300">
              {banner.subtitle}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-wide">
              {banner.title}
            </h1>
            <Link
              href={banner.buttonLink}
              className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition"
            >
              {banner.buttonText}
            </Link>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? 'bg-white w-6' : 'bg-white bg-opacity-50 w-2'
            }`}
          />
        ))}
      </div>

      {/* Prev Arrow */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Next Arrow */}
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

    </div>
  )
}