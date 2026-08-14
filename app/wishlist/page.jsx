'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import useWishlistStore from '@/lib/wishlistStore'
import ProductCard from '@/components/products/ProductCard'
import { HeartIcon } from '@/components/products/WishlistButton'

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items)
  const clear = useWishlistStore((state) => state.clear)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const timeout = setTimeout(() => setMounted(true), 0); return () => clearTimeout(timeout) }, [])
  const visibleItems = mounted ? items : []
  return <main className="min-h-screen bg-[#f6f6f3] text-gray-950"><section className="border-b border-gray-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-6 md:py-16"><div><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white"><HeartIcon filled /></span><p className="text-xs font-black uppercase tracking-[.22em] text-gray-400">Your saved edit</p></div><h1 className="mt-5 text-4xl font-black tracking-tight text-black md:text-6xl">Wishlist</h1><p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">Save your favourite products in one place and add them to your cart whenever you are ready.</p></div><div className="flex items-center gap-3"><span className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-black text-black">{visibleItems.length} saved</span>{visibleItems.length > 0 && <button onClick={clear} className="rounded-full px-4 py-2 text-xs font-black text-gray-500 transition hover:bg-red-50 hover:text-red-600">Clear wishlist</button>}</div></div></section><div className="mx-auto max-w-7xl px-4 py-10 md:px-6">{visibleItems.length ? <><div className="mb-6 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-widest text-gray-500">Saved products</p><Link href="/shop" className="text-xs font-black text-black underline underline-offset-4">Continue shopping</Link></div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{visibleItems.map((product) => <ProductCard key={product.id} product={product} />)}</div></> : <section className="relative overflow-hidden rounded-4xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm"><div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-gray-100 blur-3xl" /><div className="relative"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-black"><HeartIcon /></span><h2 className="mt-6 text-2xl font-black text-black">Your wishlist is waiting</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">Select the heart icon on any product to build your saved collection.</p><Link href="/shop" className="mt-7 inline-flex rounded-full bg-black px-8 py-3.5 text-sm font-black text-white transition hover:bg-gray-800">Explore collection →</Link></div></section>}</div></main>
}
