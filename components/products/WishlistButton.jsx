'use client'

import { useEffect, useState } from 'react'
import useWishlistStore from '@/lib/wishlistStore'
import { toast } from '@/components/ui/ToastProvider'

export default function WishlistButton({ product, compact = false, className = '' }) {
  const items = useWishlistStore((state) => state.items)
  const toggle = useWishlistStore((state) => state.toggle)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const timeout = setTimeout(() => setMounted(true), 0); return () => clearTimeout(timeout) }, [])
  const active = mounted && items.some((item) => item.id === product.id)
  const click = (event) => { event.preventDefault(); event.stopPropagation(); toggle(product); toast(active ? 'info' : 'success', active ? `${product.name} has been removed from your wishlist.` : `${product.name} has been saved to your wishlist.`, active ? 'Wishlist updated' : 'Saved to wishlist') }
  return <button type="button" onClick={click} aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={active} className={`${compact ? 'h-11 w-11 rounded-full' : 'w-full rounded-2xl py-4'} flex shrink-0 items-center justify-center gap-2 border-2 transition duration-200 ${active ? ' bg-black text-black!' : 'border-gray-200 bg-white text-black hover:border-black hover:bg-gray-50'} ${className}`}><HeartIcon filled={active} />{!compact && <span className="text-sm font-black uppercase tracking-wider">{active ? 'Saved' : 'Add to wishlist'}</span>}</button>
}

export function HeartIcon({ filled = false }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
}
