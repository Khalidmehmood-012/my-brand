'use client'

import { useState } from 'react'
import useCartStore from '@/lib/store'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Link from 'next/link'

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const [ordered, setOrdered] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  })

  const totalPrice = items.reduce(
    (total, i) => total + i.price * i.quantity,
    0
  )

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleOrder = () => {
    if (!form.name || !form.phone || !form.address || !form.city) return
    clearCart()
    setOrdered(true)
  }

  if (ordered) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-6">🎉</p>
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-4">
          Order Placed!
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Thank you for your order! We will contact you shortly to confirm your order.
        </p>
        <Link
          href="/shop"
          className="bg-black text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-4">
          Your Cart is Empty
        </h1>
        <Link
          href="/shop"
          className="bg-black text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition"
        >
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <h1 className="text-3xl font-bold uppercase tracking-widest mb-8">
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left — Form */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="font-bold uppercase tracking-widest text-sm border-b pb-3">
            Delivery Information
          </h2>

          {/* Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1 block">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1 block">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+92 300 1234567"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1 block">
              Delivery Address *
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="House no, Street, Area"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* City */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1 block">
              City *
            </label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select City</option>
              {['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'].map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1 block">
              Order Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any special instructions?"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* Payment */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3">
              Payment Method
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-black shrink-0" />
              <p className="text-sm font-semibold">Cash on Delivery (COD)</p>
            </div>
          </div>

        </div>

        {/* Right — Order Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="border border-gray-200 rounded-2xl p-6 sticky top-24">
            <h2 className="font-bold uppercase tracking-widest text-sm border-b pb-3 mb-4">
              Order Summary
            </h2>

            {/* Items */}
            <div className="flex flex-col gap-3 mb-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-500">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-semibold">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">Rs. {totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-semibold text-green-500">Free</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <span>Total</span>
                <span>Rs. {totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition mt-6"
            >
              Place Order 🛒
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              By placing order you agree to our Terms & Conditions
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}