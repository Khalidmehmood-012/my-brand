'use client'

import { useState } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [tracked, setTracked] = useState(false)

  const handleTrack = () => {
    if (!orderId) return
    setTracked(true)
  }

  const steps = [
    { label: 'Order Placed', icon: '📋', done: true },
    { label: 'Order Confirmed', icon: '✅', done: true },
    { label: 'Shipped', icon: '📦', done: true },
    { label: 'Out for Delivery', icon: '🚚', done: false },
    { label: 'Delivered', icon: '🎉', done: false },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Track Order' },
        ]}
      />

      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-4">
          Track Order
        </h1>
        <p className="text-gray-500 text-sm">
          Enter your order ID to track your package.
        </p>
      </div>

      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter your Order ID (e.g. MB-12345)"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
        />
        <button
          onClick={handleTrack}
          className="bg-black text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition"
        >
          Track 🔍
        </button>
      </div>

      {/* Tracking Result */}
      {tracked && (
        <div className="border border-gray-200 rounded-2xl p-8">

          {/* Order Info */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
              <p className="font-bold text-sm">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                In Transit
              </span>
            </div>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                  step.done ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.icon}
                </div>

                {/* Label */}
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${
                    step.done ? 'text-black' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                </div>

                {/* Check */}
                {step.done && (
                  <span className="text-green-500 font-bold">✓</span>
                )}
              </div>
            ))}
          </div>

          {/* Estimated Delivery */}
          <div className="mt-8 bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              Estimated Delivery
            </p>
            <p className="font-bold text-sm">2-3 Working Days</p>
          </div>

        </div>
      )}

    </div>
  )
}