'use client'

import { useState } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Link from 'next/link'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [tracked, setTracked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = () => {
    if (!orderId) {
      setError('Please enter your Order ID')
      return
    }
    setError('')
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setTracked(true)
    }, 1500)
  }

  // Sample order status - yeh backend se aayega
  const orderStatus = {
    id: orderId || 'MB-12345',
    status: 'In Transit',
    estimatedDelivery: '2-3 Working Days',
    steps: [
      { label: 'Order Placed', date: '2024-01-15 10:30 AM', done: true },
      { label: 'Order Confirmed', date: '2024-01-15 02:00 PM', done: true },
      { label: 'Shipped', date: '2024-01-16 09:00 AM', done: true },
      { label: 'Out for Delivery', date: '2024-01-17 08:00 AM', done: false },
      { label: 'Delivered', date: 'Pending', done: false },
    ]
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Track Order' },
          ]}
        />

        {/* Heading */}
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 bg-gray-100 px-4 py-2 rounded-full">
            Track Your Package
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-3">
            Track <span className="text-transparent bg-clip-text bg-linear-to-r from-black to-gray-600">Order</span>
          </h1>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
          <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
            Enter your order ID to track your package in real-time
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border-2 border-gray-200 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value)
                  setTracked(false)
                  setError('')
                }}
                placeholder="Enter your Order ID (e.g. MB-12345)"
                className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm text-black outline-none focus:border-black transition placeholder:text-gray-400 bg-white"
              />
            </div>
            <button
              onClick={handleTrack}
              disabled={loading}
              className="bg-black text-white px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-35"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Tracking...
                </>
              ) : (
                <>
                  <span>Track</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-3 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Tracking Result */}
        {tracked && (
          <div className="animate-fadeIn">
            {/* Order Info Header */}
            <div className="bg-black rounded-3xl p-6 md:p-8 text-white mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Order ID</p>
                  <p className="font-black text-lg tracking-wide">{orderStatus.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Status</p>
                  <span className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full border border-yellow-500/30">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    {orderStatus.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white border-2 border-black rounded-3xl p-6 md:p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
                Tracking Timeline
              </h3>
              
              <div className="space-y-0">
                {orderStatus.steps.map((step, index) => (
                  <div key={index} className="relative">
                    {/* Connector Line */}
                    {index < orderStatus.steps.length - 1 && (
                      <div className={`absolute left-5 top-10 w-0.5 h-10 ${
                        step.done ? 'bg-black' : 'bg-gray-200'
                      }`} />
                    )}
                    
                    <div className="flex items-start gap-4 pb-6">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        step.done 
                          ? 'bg-black text-white' 
                          : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                      }`}>
                        {step.done ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${
                          step.done ? 'text-black' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                        <p className={`text-xs ${
                          step.done ? 'text-gray-500' : 'text-gray-300'
                        }`}>
                          {step.date}
                        </p>
                      </div>

                      {/* Status Badge */}
                      {step.done && (
                        <span className="text-[8px] font-bold uppercase tracking-widest text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                          Done
                        </span>
                      )}
                      {!step.done && index === orderStatus.steps.length - 1 && (
                        <span className="text-[8px] font-bold uppercase tracking-widest text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="mt-4 bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Estimated Delivery: <span className="font-bold text-black">{orderStatus.estimatedDelivery}</span>
                </p>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-6 bg-black rounded-3xl p-6 text-center">
              <p className="text-white/60 text-xs mb-3">Need help with your order?</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest hover:text-gray-300 transition-colors"
              >
                <span>Contact Support</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* No Order Message */}
        {!tracked && !loading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 border-2 border-gray-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">Enter your order ID above to track</p>
          </div>
        )}

      </div>
    </div>
  )
}