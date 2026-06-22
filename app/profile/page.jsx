'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/lib/authStore'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, logout, initAuth } = useAuthStore()

  useEffect(() => {
  const unsubscribe = initAuth()
  return () => {
    if (typeof unsubscribe === 'function') unsubscribe()
  }
}, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-black rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  // Stats data
  const stats = [
    { label: 'Orders', value: '0', trend: '+0%' },
    { label: 'Spent', value: 'Rs. 0', trend: '+0%' },
    { label: 'Reviews', value: '0', trend: '+0%' },
    { label: 'Wishlist', value: '0', trend: '+0%' },
  ]

  // Recent activity data
  const recentActivity = [
    { id: 1, action: 'Browsed T-Shirts', time: '2 min ago' },
    { id: 2, action: 'Added to wishlist', time: '1 hour ago' },
    { id: 3, action: 'Viewed Hoodies', time: '3 hours ago' },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">

      {/* Hero Section - Modern Cover */}
      <div className="relative bg-black text-white overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left - Profile Info */}
            <div className="flex items-center gap-6 w-full md:w-auto">
              {/* Avatar with Ring */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-white/20 to-white/5 animate-pulse" />
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  {user.photo ? (
                    <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center text-5xl font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-black" />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {user.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 text-sm">{user.email}</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full" />
                  <span className="text-gray-500 text-xs">Member since {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Active
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">Verified ✓</span>
                </div>
              </div>
            </div>

            {/* Right - Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Link
                href="/shop"
                className="flex-1 md:flex-none px-6 py-3 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Browse Store
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 md:flex-none px-6 py-3 border border-white/30 text-white rounded-full text-sm font-bold hover:bg-white hover:text-black transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Stats Bar - Floating Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
                <span className="inline-block mt-1 text-xs text-green-400">{stat.trend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* Left Column - Quick Actions */}
    <div className="lg:col-span-1 space-y-6">
      {/* Quick Actions */}
      <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Quick Actions</h3>
        <div className="space-y-1">
          {[
            { label: 'Track Order', href: '/track-order' },
            { label: 'Wishlist', href: '/wishlist' },
            { label: 'My Reviews', href: '/reviews' },
            { label: 'Support', href: '/support' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-black hover:text-white transition-all duration-200 group border border-transparent hover:border-black"
            >
              <span className="text-sm font-medium text-gray-700 group-hover:text-white">{item.label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0">
              <div className="w-2 h-2 mt-2 rounded-full bg-black shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Right Column - Main Content */}
    <div className="lg:col-span-2 space-y-6">

      {/* Order History Preview */}
      <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-black">Recent Orders</h3>
          <Link href="/orders" className="text-xs font-bold text-black hover:underline">
            View All →
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm mb-4">No orders placed yet</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all hover:scale-105"
          >
            Start Shopping
          </Link>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Recommended For You</h3>
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No items recommended yet</p>
          <p className="text-xs text-gray-400 mt-1">Start shopping to get personalized recommendations</p>
        </div>
      </div>

    </div>

  </div>
</div>

    </div>
  )
}