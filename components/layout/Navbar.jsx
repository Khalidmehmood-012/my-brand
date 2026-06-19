'use client'
import megaMenuData from '@/data/megamenu'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import useCartStore from '@/lib/store'
import CartDrawer from './CartDrawer'
import MegaMenu from './MegaMenu'

export default function Navbar() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const timeoutRef = useRef(null)
  const items = useCartStore((state) => state.items)
  const totalItems = items.reduce((total, i) => total + i.quantity, 0)

  const handleMouseEnter = (slug) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(slug)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 100)
  }

 const navLinks = [
  {
    label: 'Home',
    href: '/',
    slug: null,
    columns: [],
    images: [],
  },
  {
    label: 'T-Shirts',
    href: '/collections/tshirts',
    slug: 'tshirts',
    ...megaMenuData.tshirts,
  },
  {
    label: 'Hoodies',
    href: '/collections/hoodies',
    slug: 'hoodies',
    ...megaMenuData.hoodies,
  },
  {
    label: 'Accessories',
    href: '/collections/accessories',
    slug: 'accessories',
    ...megaMenuData.accessories,
  },
  {
    label: 'Sale',
    href: '/sale',
    slug: 'sale',
    ...megaMenuData.sale,
  },
]

  const isActive = (item) => {
    if (item.href === '/') return pathname === '/'
    return pathname === item.href || pathname.startsWith(`/collections/${item.slug}`)
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-widest uppercase text-black">
            MyBrand
          </Link>

          {/* Nav Links — Desktop */}
          <div className="hidden md:flex items-center gap-8 h-full">
            {navLinks.map((item) => (
              <div
                key={item.label}
                className="relative h-full flex items-center"
                onMouseEnter={() => handleMouseEnter(item.slug)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  className={`text-sm font-semibold uppercase tracking-wide transition-all border-b-2 pb-1 ${
                    isActive(item) || activeMenu === item.slug
                      ? 'border-black text-black'
                      : 'border-transparent'
                  } ${
                    item.label === 'Sale'
                      ? 'text-red-500 hover:text-red-700'
                      : 'text-black hover:text-gray-500'
                  }`}
                >
                  {item.label}
                </Link>

                {/* Mega Menu */}
                {activeMenu === item.slug && item.columns.length > 0 && (
                  <MegaMenu
                    item={item}
                    onMouseEnter={() => handleMouseEnter(item.slug)}
                    onMouseLeave={handleMouseLeave}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <Link href="/shop" className="text-black hover:text-gray-500 transition">
              🔍
            </Link>
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative text-black hover:text-gray-500 transition"
            >
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-black text-xl font-bold"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-semibold uppercase tracking-wide transition ${
                  item.label === 'Sale'
                    ? 'text-red-500'
                    : 'text-black hover:text-gray-500'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}