'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import useCartStore from '@/lib/store'
import useAuthStore from '@/lib/authStore'
import CartDrawer from './CartDrawer'
import MegaMenu from './MegaMenu'
import products from '@/data/products'
import megaMenuData from '@/data/megamenu'

export default function Navbar() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const timeoutRef = useRef(null)
  const items = useCartStore((state) => state.items)
  const totalItems = items.reduce((total, i) => total + i.quantity, 0)
  const { user, logout, initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [])

  const handleMouseEnter = (label) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(label)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 150)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.length > 1) {
      const results = products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const navLinks = [
    {
      label: 'Home',
      href: '/',
      columns: [],
      images: [],
    },
    {
      label: 'Women',
      href: '/collections/women-tshirts',
      ...megaMenuData.women,
    },
    {
      label: 'Men',
      href: '/collections/tshirts',
      ...megaMenuData.men,
    },
    {
      label: 'Hoodies',
      href: '/collections/hoodies',
      ...megaMenuData.hoodies,
    },
    {
      label: 'Accessories',
      href: '/collections/accessories',
      ...megaMenuData.accessories,
    },
    {
      label: 'Sale',
      href: '/sale',
      ...megaMenuData.sale,
    },
  ]

  const isActive = (item) => {
    if (item.href === '/') return pathname === '/'
    return pathname.startsWith(item.href)
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-widest uppercase text-black">
            Komrez
          </Link>

          {/* Nav Links — Desktop */}
          <div className="hidden md:flex items-center gap-8 h-full">
            {navLinks.map((item) => (
              <div
                key={item.label}
                className="relative h-full flex items-center"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  className={`text-sm font-semibold uppercase tracking-wide transition-all border-b-2 pb-1 ${
                    isActive(item) || activeMenu === item.label
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
                {activeMenu === item.label && item.columns && item.columns.length > 0 && (
                  <MegaMenu
                    item={item}
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">

            {/* Search Icon */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen)
                setSearchQuery('')
                setSearchResults([])
              }}
              className="text-black hover:text-gray-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Profile Icon */}
            {user ? (
              <Link href="/profile" className="text-black hover:text-gray-500 transition">
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-black"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )}
              </Link>
            ) : (
              <Link href="/login" className="text-black hover:text-gray-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>
            )}

            {/* Cart Icon */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative text-black hover:text-gray-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-black"
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>

          </div>

        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 px-4 py-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full border border-gray-200 rounded-xl pl-12 pr-12 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-black placeholder-gray-400 bg-white"
                />
                <button
                  onClick={closeSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-3 flex flex-col gap-2 max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black">{product.name}</p>
                        <p className="text-xs text-gray-400">Rs. {product.price}</p>
                      </div>
                      <span className="ml-auto text-xs text-gray-400 uppercase">
                        {product.category}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* No Results */}
              {searchQuery.length > 1 && searchResults.length === 0 && (
                <div className="mt-3 text-center py-6 text-gray-400 text-sm">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}

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
            <hr />
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-black"
                >
                  My Profile
                </Link>
                <button
                  onClick={async () => {
                    await logout()
                    setMobileOpen(false)
                  }}
                  className="text-sm font-semibold text-red-500 text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-black"
              >
                Login / Register
              </Link>
            )}
          </div>
        )}

      </nav>

      {/* Cart Drawer */}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}