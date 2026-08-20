'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useCartStore from '@/lib/store'
import useAuthStore from '@/lib/authStore'
import CartDrawer from './CartDrawer'
import MegaMenu from './MegaMenu'
import useProducts from '@/lib/useProducts'
import megaMenuData from '@/data/megamenu'
import usePublicConfig from '@/lib/usePublicConfig'
import NotificationBell from './NotificationBell'
import useWishlistStore from '@/lib/wishlistStore'
import { HeartIcon } from '@/components/products/WishlistButton'

const baseNavLinks = [
  { label: 'Home', href: '/', columns: [], images: [] },
  { label: 'Women', href: '/collections/women-tshirts', ...megaMenuData.women },
  { label: 'Men', href: '/collections/tshirts', ...megaMenuData.men },
  { label: 'Accessories', href: '/collections/accessories', ...megaMenuData.accessories },
  { label: 'Sale', href: '/sale', ...megaMenuData.sale },
]

export default function Navbar() {
  const { categories } = usePublicConfig()
  const navLinks = useMemo(() => {
    if (!categories.length) return baseNavLinks
    const belongsTo = (category, section) => (category.sections?.length ? category.sections : category.slug === 'accessories' ? ['accessories'] : ['men', 'women']).includes(section)
    return baseNavLinks.map((item) => {
      const section = item.label.toLowerCase()
      if (!['men', 'women', 'accessories'].includes(section)) return item
      const relevant = categories.filter((category) => belongsTo(category, section))
      const columns = relevant.map((category) => ({ heading: category.name, links: [{ name: `All ${section === 'women' ? 'Women ' : section === 'men' ? 'Men ' : ''}${category.name}`, href: `/collections/${category.slug}${section === 'accessories' ? '' : `?gender=${section}`}`, ...(category.label ? { badge: category.label } : {}) }, ...(category.subcategories || []).map((name) => ({ name, href: `/collections/${category.slug}?${section === 'accessories' ? '' : `gender=${section}&`}subcategory=${encodeURIComponent(name)}`, ...(category.subcategoryBadges?.[name] ? { badge: category.subcategoryBadges[name] } : {}) }))] }))
      return columns.length ? { ...item, columns } : { ...item, columns: [] }
    })
  }, [categories])
  const pathname = usePathname()
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [openingProduct, setOpeningProduct] = useState(null)
  const timeoutRef = useRef(null)
  const items = useCartStore((state) => state.items)
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const wishlistCount = useWishlistStore((state) => state.items.length)
  const [wishlistMounted, setWishlistMounted] = useState(false)
  const { user, logout, initAuth } = useAuthStore()
  const { products } = useProducts()
  const activeMenuItem = navLinks.find((item) => item.label === activeMenu)
  const loginHref = `/login?returnTo=${encodeURIComponent(pathname || '/')}`

  useEffect(() => { void initAuth() }, [initAuth])
  useEffect(() => { const timeout = setTimeout(() => setWishlistMounted(true), 0); return () => clearTimeout(timeout) }, [])

  useEffect(() => {
    if (!mobileOpen && !searchOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen, searchOpen])

  useEffect(() => {
    if (!mobileOpen && !searchOpen) return

    const handleEscape = (event) => {
      if (event.key !== 'Escape' || openingProduct) return
      setMobileOpen(false)
      setMobileExpanded(null)
      setSearchOpen(false)
      setSearchQuery('')
      setSearchResults([])
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [mobileOpen, searchOpen, openingProduct])

  const isActive = (item) => {
    if (item.href === '/') return pathname === '/'
    return pathname.startsWith(item.href)
  }

  const handleMouseEnter = (label) => {
    if (searchOpen) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(label)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 280)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setOpeningProduct(null)

    const normalizedQuery = query.trim().toLowerCase()
    if (normalizedQuery.length < 2) {
      setSearchResults([])
      return
    }

    const results = products
      .filter((product) =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 8)

    setSearchResults(results)
  }

  const openSearch = () => {
    setMobileOpen(false)
    setMobileExpanded(null)
    setActiveMenu(null)
    setSearchOpen(true)
    setSearchQuery('')
    setSearchResults([])
    setOpeningProduct(null)
  }

  const closeSearch = () => {
    if (openingProduct) return
    setSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const openProduct = (event, product) => {
    event.preventDefault()
    if (openingProduct) return

    setOpeningProduct(product.id)
    window.setTimeout(() => {
      router.push(`/products/${product.slug}`)
      window.setTimeout(() => {
        setSearchOpen(false)
        setSearchQuery('')
        setSearchResults([])
        setOpeningProduct(null)
      }, 500)
    }, 350)
  }

  const toggleMobileMenu = () => {
    setSearchOpen(false)
    setActiveMenu(null)
    setMobileExpanded(null)
    setMobileOpen((open) => !open)
  }

  const handleDesktopNavClick = (event, item) => {
    if (!searchOpen) return

    event.preventDefault()
    setSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
    if (item.columns?.length) setActiveMenu(item.label)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="flex h-8 items-center justify-center bg-gray-950 px-4 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-white sm:text-[10px]">
          <span>Free shipping above Rs. 2,000</span>
          <span className="mx-2 text-white/30">•</span>
          <Link href="/sale" className="text-white/70 underline underline-offset-2 transition hover:text-white">
            Shop the sale
          </Link>
        </div>

        <div
          onClickCapture={() => {
            if (!searchOpen || openingProduct) return
            setSearchOpen(false)
            setSearchQuery('')
            setSearchResults([])
          }}
          className="relative mx-auto flex h-17 max-w-7xl min-w-0 items-center justify-between overflow-visible px-3 sm:h-18 sm:px-4"
        >
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-black transition hover:bg-gray-100 lg:hidden"
          >
            <span className={`absolute h-0.5 w-5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute h-0.5 w-5 bg-current transition-all duration-300 ${mobileOpen ? 'scale-x-0 opacity-0' : ''}`} />
            <span className={`absolute h-0.5 w-5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
          </button>

          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="absolute left-1/2 -translate-x-1/2 text-lg font-black uppercase tracking-[0.14em] text-black sm:text-xl sm:tracking-[0.18em] lg:left-4 lg:translate-x-0 lg:text-2xl"
          >
            Komrez<span className="text-gray-400">.</span>
          </Link>

          <div className="absolute left-1/2 hidden h-full -translate-x-1/2 items-center gap-6 lg:flex xl:gap-9">
            {navLinks.map((item) => (
              <div
                key={item.label}
                className="relative flex h-full items-center"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  onClick={(event) => handleDesktopNavClick(event, item)}
                  className={`relative py-2 text-xs font-black uppercase tracking-[0.14em] transition-colors ${
                    item.label === 'Sale' ? 'text-red-500 hover:text-red-700' : 'text-gray-800 hover:text-black'
                  }`}
                >
                  {item.label}
                  <span className={`absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-current transition-transform duration-300 ${
                    isActive(item) || activeMenu === item.label ? 'scale-x-100' : 'scale-x-0'
                  }`} />
                </Link>

              </div>
            ))}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
            <NotificationBell user={user} />
            <Link href="/wishlist" aria-label="Wishlist" className="relative hidden h-10 w-10 items-center justify-center rounded-full text-black transition hover:bg-gray-100 lg:flex"><HeartIcon />{wishlistMounted && wishlistCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-black text-white">{wishlistCount}</span>}</Link>
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search products"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-black transition hover:bg-gray-100 lg:flex"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {user ? (
              <Link href="/profile" aria-label="My profile" className="hidden h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-black transition hover:border-black hover:bg-black hover:text-white sm:h-10 sm:w-10 lg:flex">
                {user.photo ? (
                  <img src={user.photo} alt={user.name || 'Profile'} className="h-7 w-7 rounded-full border border-black object-cover" />
                ) : (
                  <ProfileIcon />
                )}
              </Link>
            ) : (
              <Link href={loginHref} aria-label="Login" className="hidden h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-black transition hover:border-black hover:bg-black hover:text-white sm:h-10 sm:w-10 lg:flex">
                <ProfileIcon />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={`Cart with ${totalItems} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-black transition hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {!searchOpen && activeMenuItem?.columns?.length > 0 && (
          <MegaMenu
            item={activeMenuItem}
            onMouseEnter={() => handleMouseEnter(activeMenuItem.label)}
            onMouseLeave={handleMouseLeave}
          />
        )}

        <div
          className={`absolute left-0 top-full z-40 h-[calc(100vh-6.25rem)] w-full border-t border-gray-100 bg-white shadow-2xl transition-all duration-500 ease-out lg:hidden ${
            mobileOpen ? 'visible translate-x-0 opacity-100' : 'invisible -translate-x-full opacity-70'
          }`}
        >
          <div className="h-full overflow-y-auto overscroll-contain px-5 pb-8 pt-4">
            <div className="mb-4 grid grid-cols-3 gap-2">
              <button type="button" onClick={openSearch} className="flex min-w-0 flex-col items-center gap-1.5 rounded-xl bg-stone-50 px-2 py-3 text-[10px] font-black uppercase text-black"><SearchIcon />Search</button>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="relative flex min-w-0 flex-col items-center gap-1.5 rounded-xl bg-stone-50 px-2 py-3 text-[10px] font-black uppercase text-black"><HeartIcon />Wishlist{wishlistMounted && wishlistCount > 0 && <span className="absolute right-2 top-2 rounded-full bg-black px-1.5 py-0.5 text-[8px] text-white">{wishlistCount}</span>}</Link>
              <Link href={user ? '/profile' : loginHref} onClick={() => setMobileOpen(false)} className="flex min-w-0 flex-col items-center gap-1.5 rounded-xl bg-stone-50 px-2 py-3 text-[10px] font-black uppercase text-black"><ProfileIcon />{user ? 'Profile' : 'Login'}</Link>
            </div>
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Browse Komrez</p>
                <p className="text-sm font-bold text-black">Find your next favorite</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                <ArrowRightIcon />
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {navLinks.map((item, index) => {
                const hasChildren = Boolean(item.columns?.length)
                const isExpanded = mobileExpanded === item.label

                return (
                  <div
                    key={item.label}
                    style={{ transitionDelay: mobileOpen ? `${index * 45}ms` : '0ms' }}
                    className={`transition-all duration-300 ${
                      mobileOpen ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
                    }`}
                  >
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() => setMobileExpanded(isExpanded ? null : item.label)}
                        aria-expanded={isExpanded}
                        className={`flex w-full items-center justify-between py-4 text-left text-base font-black uppercase tracking-[0.12em] ${
                          item.label === 'Sale' ? 'text-red-500' : 'text-gray-950'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                          isExpanded ? 'rotate-180 bg-black text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <ChevronDownIcon />
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between py-4 text-base font-black uppercase tracking-[0.12em] text-gray-950"
                      >
                        <span>{item.label}</span>
                        <ArrowRightIcon />
                      </Link>
                    )}

                    {hasChildren && (
                      <div className={`grid overflow-hidden transition-all duration-500 ease-in-out ${
                        isExpanded ? 'max-h-350 grid-rows-[1fr] pb-5 opacity-100' : 'max-h-0 grid-rows-[0fr] opacity-0'
                      }`}>
                        <div className="min-h-0 overflow-hidden rounded-2xl bg-stone-50">
                          <div className="p-4">
                            <Link
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="mb-4 flex items-center justify-between rounded-xl bg-black px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white"
                            >
                              View all {item.label}
                              <ArrowRightIcon />
                            </Link>

                            <div className="space-y-5">
                              {item.columns.map((column, columnIndex) => (
                                <div
                                  key={column.heading}
                                  className={`transition-all duration-500 ${
                                    isExpanded ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                                  }`}
                                  style={{ transitionDelay: isExpanded ? `${columnIndex * 70 + 100}ms` : '0ms' }}
                                >
                                  <p className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    {column.heading}
                                  </p>
                                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                    {column.links.map((link) => (
                                      <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-600 transition hover:bg-white hover:text-black"
                                      >
                                        <span>{link.name}</span>
                                        {link.badge && (
                                          <span className={`rounded-full px-1.5 py-0.5 text-[7px] font-black text-white ${
                                            link.badge === 'HOT' ? 'bg-orange-500' : 'bg-red-500'
                                          }`}>
                                            {link.badge}
                                          </span>
                                        )}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200 p-4">
              {user ? (
                <div className="flex items-center gap-3">
                  {user.photo ? (
                    <img src={user.photo} alt={user.name || 'Profile'} className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100"><ProfileIcon /></span>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="block truncate text-sm font-bold text-black">
                      {user.name || 'My Profile'}
                    </Link>
                    <p className="truncate text-xs text-gray-400">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await logout()
                      setMobileOpen(false)
                    }}
                    className="text-xs font-bold text-red-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href={loginHref} onClick={() => setMobileOpen(false)} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-black">Login or create an account</p>
                    <p className="mt-1 text-xs text-gray-400">Track orders and checkout faster</p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white"><ArrowRightIcon /></span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div
          className={`absolute left-0 right-0 top-full z-50 border-t border-gray-100 bg-white shadow-2xl transition-all duration-300 ${
            searchOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-3xl px-4 py-5 sm:py-7">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.24em] text-gray-400">Search Komrez</p>
                <p className="text-sm font-bold text-gray-950">Find your perfect product</p>
              </div>
              <button
                type="button"
                onClick={closeSearch}
                disabled={Boolean(openingProduct)}
                aria-label="Close search"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200 hover:text-black disabled:opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                autoFocus={searchOpen}
                value={searchQuery}
                onChange={(event) => handleSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && searchResults[0]) openProduct(event, searchResults[0])
                }}
                disabled={Boolean(openingProduct)}
                placeholder="Search T-shirts, hoodies, accessories..."
                spellCheck={false}
                className="w-full rounded-2xl border border-gray-200 bg-stone-50 py-4 pl-12 pr-4 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5 disabled:opacity-60"
              />
            </div>

            {searchQuery.trim().length === 1 && (
              <p className="px-1 pt-3 text-xs text-gray-400">Enter at least 2 characters to see results.</p>
            )}

            {searchResults.length > 0 && (
              <div className="mt-4 max-h-[55vh] space-y-1 overflow-y-auto pr-1">
                <div className="flex items-center justify-between px-2 pb-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Matching products</p>
                  <p className="text-[10px] text-gray-400">{searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}</p>
                </div>
                {searchResults.map((product) => {
                  const isOpening = openingProduct === product.id
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={(event) => openProduct(event, product)}
                      className={`group relative flex items-center gap-4 rounded-2xl p-3 transition ${
                        isOpening ? 'bg-black text-white' : 'hover:bg-stone-50'
                      } ${openingProduct && !isOpening ? 'pointer-events-none opacity-35' : ''}`}
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{product.name}</p>
                        <p className={`mt-1 text-xs ${isOpening ? 'text-white/60' : 'text-gray-400'}`}>
                          Rs. {product.price} <span className="mx-1">•</span> <span className="capitalize">{product.category}</span>
                        </p>
                      </div>
                      {isOpening ? (
                        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Opening product
                        </span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}

            {searchQuery.trim().length > 1 && searchResults.length === 0 && (
              <div className="mt-4 rounded-2xl bg-stone-50 px-5 py-8 text-center">
                <p className="text-sm font-bold text-gray-900">No products found</p>
                <p className="mt-1 text-xs text-gray-400">Check the spelling or try a category such as T-shirts or hoodies.</p>
              </div>
            )}
          </div>
        </div>

      </nav>

      {(mobileOpen || searchOpen) && !openingProduct && (
        <button
          type="button"
          aria-label={searchOpen ? 'Close search' : 'Close menu'}
          onClick={() => {
            setMobileOpen(false)
            setMobileExpanded(null)
            closeSearch()
          }}
          className="fixed inset-0 z-40 cursor-default bg-black/25 backdrop-blur-[2px]"
        />
      )}

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}

function ProfileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}
