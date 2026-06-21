'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/lib/authStore'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, logout, initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Profile Header */}
      <div className="bg-black text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 mb-8">

        {/* Avatar */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
          {user.photo ? (
            <img
              src={user.photo}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold uppercase tracking-widest mb-1">
            {user.name}
          </h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-white text-black px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition"
        >
          Logout
        </button>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: '0' },
          { label: 'Total Spent', value: 'Rs. 0' },
          { label: 'Reviews Given', value: '0' },
          { label: 'Wishlist Items', value: '0' },
        ].map((stat) => (
          <div key={stat.label} className="border border-gray-200 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* My Orders */}
        <div className="border border-gray-200 rounded-2xl p-6">
          <h2 className="font-bold uppercase tracking-widest text-sm mb-4 flex items-center justify-between">
            My Orders
            <span className="text-gray-400 font-normal text-xs">0 orders</span>
          </h2>
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-gray-400 text-sm mb-4">No orders yet</p>
            <Link
              href="/shop"
              className="bg-black text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition"
            >
              Start Shopping
            </Link>
          </div>
        </div>

        {/* My Reviews */}
        <div className="border border-gray-200 rounded-2xl p-6">
          <h2 className="font-bold uppercase tracking-widest text-sm mb-4 flex items-center justify-between">
            My Reviews
            <span className="text-gray-400 font-normal text-xs">0 reviews</span>
          </h2>
          <div className="text-center py-8">
            <p className="text-4xl mb-3">⭐</p>
            <p className="text-gray-400 text-sm mb-4">No reviews yet</p>
            <Link
              href="/shop"
              className="bg-black text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition"
            >
              Buy & Review
            </Link>
          </div>
        </div>

        {/* Personal Info */}
        <div className="border border-gray-200 rounded-2xl p-6">
          <h2 className="font-bold uppercase tracking-widest text-sm mb-4">
            Personal Info
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Full Name', value: user.name },
              { label: 'Email', value: user.email },
              { label: 'Member Since', value: new Date().toLocaleDateString() },
            ].map((info) => (
              <div key={info.label} className="flex justify-between text-sm border-b pb-2">
                <span className="text-gray-400">{info.label}</span>
                <span className="font-semibold">{info.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="border border-gray-200 rounded-2xl p-6">
          <h2 className="font-bold uppercase tracking-widest text-sm mb-4">
            Quick Links
          </h2>
          <div className="flex flex-col gap-2">
            {[
              { label: '🛍️ Continue Shopping', href: '/shop' },
              { label: '📦 Track Order', href: '/track-order' },
              { label: '❓ FAQs', href: '/faqs' },
              { label: '📞 Contact Us', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 text-sm hover:bg-gray-50 transition"
              >
                <span>{link.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}