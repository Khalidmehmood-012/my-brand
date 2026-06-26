'use client'

import { useState, useRef } from 'react'
import useCartStore from '@/lib/store'

export default function CustomOrder() {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef(null)
  
  const [form, setForm] = useState({
    shirtType: 'Half Sleeve',
    color: 'Black',
    size: 'M',
    printType: 'None',
    customText: '',
    notes: '',
  })

  const shirtTypes = ['Half Sleeve', 'Full Sleeve', 'Polo', 'Oversized', 'Shoulder']
  const colors = ['Black', 'White', 'Grey', 'Navy Blue', 'Red', 'Blue', 'Green', 'Yellow']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const printTypes = ['None', 'Text Print', 'Logo Print', 'Full Design', 'Front Print', 'Back Print']

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddToCart = () => {
    // Image ko base64 mein convert karke store karein
    const customProduct = {
      id: `custom-${Date.now()}`,
      name: `Custom ${form.shirtType} - ${form.color}`,
      price: 2500,
      image: imagePreview || '/images/products/custom-shirt-placeholder.jpg',
      category: 'tshirts',
      selectedSize: form.size,
      isCustom: true,
      customDetails: {
        shirtType: form.shirtType,
        color: form.color,
        size: form.size,
        printType: form.printType,
        customText: form.customText,
        notes: form.notes,
        hasImage: !!imageFile,
        imageName: imageFile?.name || '',
      }
    }
    addItem(customProduct, form.size)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="mt-12 border-t-2 border-black pt-10">
      <div className="bg-white border-2 border-black rounded-3xl p-6 md:p-8 shadow-lg">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-black">
              Customize Your Shirt
            </h2>
            <p className="text-xs text-gray-400">Don't like our designs? Create your own!</p>
          </div>
          <span className="ml-auto text-xs bg-black text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            New
          </span>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Shirt Type */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-black block mb-1.5">
              Shirt Type *
            </label>
            <select
              name="shirtType"
              value={form.shirtType}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-black outline-none focus:border-black transition bg-gray-50"
            >
              {shirtTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-black block mb-1.5">
              Color *
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setForm((prev) => ({ ...prev, color }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    form.color === color
                      ? 'bg-black text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-black block mb-1.5">
              Size *
            </label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setForm((prev) => ({ ...prev, size }))}
                  className={`w-10 h-10 rounded-lg text-xs font-bold uppercase transition-all duration-200 ${
                    form.size === size
                      ? 'bg-black text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Print Type */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-black block mb-1.5">
              Print Type
            </label>
            <select
              name="printType"
              value={form.printType}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-black outline-none focus:border-black transition bg-gray-50"
            >
              {printTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Custom Text */}
          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black block mb-1.5">
              Custom Text (Optional)
            </label>
            <input
              type="text"
              name="customText"
              value={form.customText}
              onChange={handleChange}
              placeholder="Enter text you want on your shirt..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-black outline-none focus:border-black transition bg-gray-50"
            />
          </div>

          {/* Image Upload - NEW */}
          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black block mb-1.5">
              Upload Your Design / Image (Optional)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Upload Button */}
              <div className="flex-1 w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 text-sm text-gray-500 hover:border-black hover:text-black transition cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Click to upload image (PNG, JPG, SVG)
                </label>
                <p className="text-[10px] text-gray-400 mt-1">Max file size: 5MB. For best results, use transparent PNG.</p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-black shrink-0 bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Uploaded design"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition shadow-lg"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black block mb-1.5">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any specific instructions about design, placement, or something else..."
              rows={2}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-black outline-none focus:border-black transition bg-gray-50 resize-none"
            />
          </div>

        </div>

        {/* Uploaded Image Indicator */}
        {imagePreview && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm text-green-700 font-medium">Image uploaded successfully!</span>
          </div>
        )}

        {/* Price & Add to Cart */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t-2 border-gray-100">
          <div>
            <p className="text-xs text-gray-400">Custom Shirt Price</p>
            <p className="text-2xl font-black text-black">Rs. 2,500</p>
            <p className="text-[10px] text-gray-400">*Additional charges may apply for complex designs</p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`w-full sm:w-auto px-10 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg active:scale-95'
            }`}
          >
            {added ? (
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Added to Cart!
              </span>
            ) : (
              'Add Custom Shirt to Cart'
            )}
          </button>
        </div>

        {/* Note */}
        <p className="text-[10px] text-gray-400 text-center mt-4 border-t border-gray-100 pt-4">
          Custom orders are processed within 3-5 business days. Our team will contact you for design confirmation.
        </p>

      </div>
    </div>
  )
}