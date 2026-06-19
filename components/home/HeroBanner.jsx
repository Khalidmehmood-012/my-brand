'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import banners from '@/data/banners'

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-125 md:h-150 overflow-hidden bg-gray-900">

      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40" />

          {/* Content */}
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
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition ${
              index === current ? 'bg-white w-6' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Prev / Next Arrows */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
      >
        ›
      </button>

    </div>
  )
}