'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import useCartStore from '@/lib/store'
import WishlistButton from './WishlistButton'
import { toast } from '@/components/ui/ToastProvider'

export default function QuickViewModal({ product, open, onClose }) {
  const [mounted, setMounted] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [imageIndex, setImageIndex] = useState(0)
  const addItem = useCartStore((state) => state.addItem)
  const cartItems = useCartStore((state) => state.items)
  const images = product.images?.length ? product.images : [product.image]
  const reserved = cartItems.filter((item) => item.id === product.id).reduce((sum, item) => sum + item.quantity, 0)
  const available = Math.max(0, Number(product.stock || 0) - reserved)

  useEffect(() => { const timeout = setTimeout(() => setMounted(true), 0); return () => clearTimeout(timeout) }, [])
  useEffect(() => {
    if (open) {
      let frame
      const timeout = setTimeout(() => {
        setRendered(true)
        frame = requestAnimationFrame(() => setVisible(true))
      }, 0)
      return () => { clearTimeout(timeout); if (frame) cancelAnimationFrame(frame) }
    }
    const frame = requestAnimationFrame(() => setVisible(false))
    const timeout = setTimeout(() => setRendered(false), 250)
    return () => { cancelAnimationFrame(frame); clearTimeout(timeout) }
  }, [open])
  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', closeOnEscape)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', closeOnEscape); document.body.style.overflow = previous }
  }, [open, onClose])
  useEffect(() => {
    if (!open) return
    const timeout = setTimeout(() => { setSelectedSize(product.sizes?.length === 1 ? product.sizes[0] : ''); setImageIndex(0) }, 0)
    return () => clearTimeout(timeout)
  }, [open, product.sizes])

  if (!mounted || !rendered) return null
  const add = () => {
    if (!selectedSize) return toast('warning', 'Select a size before adding this product to your cart.', 'Select a size')
    if (available <= 0) return toast('warning', 'All available stock is already reserved in your cart.', 'Stock reserved')
    if (addItem(product, selectedSize)) toast('success', `${product.name} has been added to your cart.`, 'Added to cart')
  }

  return createPortal(
    <div className={`fixed inset-0 z-200 flex items-center justify-center p-3 backdrop-blur-sm transition-colors duration-250 ${visible ? 'bg-black/65' : 'pointer-events-none bg-black/0'}`} role="dialog" aria-modal="true" aria-label={`Quick view ${product.name}`}>
      <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close quick view" />
      <section className={`relative max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl transition-all duration-250 ease-out ${visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <button onClick={onClose} className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-xl text-black shadow-md hover:bg-black hover:text-white" aria-label="Close">×</button>
        <div className="grid md:grid-cols-2">
          <div className="bg-[#f3f3f0] p-4 md:p-6">
            <div className="aspect-square overflow-hidden rounded-2xl bg-white"><img src={images[imageIndex]} alt={product.name} className="h-full w-full object-cover" /></div>
            {images.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto">{images.map((image, index) => <button key={image} onClick={() => setImageIndex(index)} className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${index === imageIndex ? 'border-black' : 'border-transparent'}`}><img src={image} alt={`${product.name} view ${index + 1}`} className="h-full w-full object-cover" /></button>)}</div>}
          </div>
          <div className="flex flex-col p-6 md:p-9">
            <div className="pr-12"><p className="text-[10px] font-black uppercase tracking-[.22em] text-gray-400">Quick view</p><h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-black md:text-3xl">{product.name}</h2><div className="mt-4 flex flex-wrap items-center gap-3"><b className="text-2xl text-black">Rs. {Number(product.price).toLocaleString()}</b>{product.originalPrice > product.price && <span className="text-sm text-gray-400 line-through">Rs. {Number(product.originalPrice).toLocaleString()}</span>}</div></div>
            <p className="mt-5 line-clamp-4 text-sm leading-6 text-gray-600">{product.description || 'Premium quality, comfortable fit, and a versatile design made for everyday wear.'}</p>
            {product.stock > 0 && product.stock <= 5 && <p className="mt-4 text-xs font-black uppercase text-red-600">Only {available} available</p>}
            <div className="mt-6"><div className="flex items-center justify-between"><p className="text-xs font-black uppercase tracking-wider text-black">Select size</p><Link href={`/products/${product.slug}`} onClick={onClose} className="text-[10px] font-bold text-gray-400 underline">Size guide</Link></div><div className="mt-3 flex flex-wrap gap-2">{(product.sizes?.length ? product.sizes : ['One Size']).map((size) => <button key={size} onClick={() => setSelectedSize(size)} className={`min-w-11 rounded-xl border px-3 py-2.5 text-xs font-black ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-black hover:border-black'}`}>{size}</button>)}</div></div>
            <div className="mt-auto space-y-3 pt-7">{available > 0 && <button onClick={add} className="w-full rounded-xl bg-black py-4 text-sm font-black uppercase tracking-wider text-white hover:bg-gray-800">Add to cart</button>}<WishlistButton product={product} /><Link href={`/products/${product.slug}`} onClick={onClose} className="block w-full rounded-xl border-2 border-black py-3.5 text-center text-xs font-black uppercase tracking-wider text-black hover:bg-black hover:text-white">View full details</Link></div>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  )
}
