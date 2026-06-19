'use client'

import { useState } from 'react'

export default function ProductImageGallery({ images, name }) {
  const [selectedImage, setSelectedImage] = useState(images[0])

  return (
    <div className="flex flex-col gap-4">

      {/* Main Image */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={selectedImage}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                selectedImage === img
                  ? 'border-black'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={img}
                alt={`${name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

    </div>
  )
}