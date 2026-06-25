'use client'

import { useState } from 'react'
import useCartStore from '@/lib/store'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Link from 'next/link'

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const [ordered, setOrdered] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [showAccountDetails, setShowAccountDetails] = useState(false)
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

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method)
    if (method === 'easypaisa' || method === 'jazzcash') {
      setShowAccountDetails(true)
    } else {
      setShowAccountDetails(false)
    }
  }

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.address || !form.city) return
    try {
      const { db } = await import('@/lib/firebase')
      const { collection, addDoc } = await import('firebase/firestore')
      const useAuthStore = (await import('@/lib/authStore')).default
      const user = useAuthStore.getState().user

      await addDoc(collection(db, 'orders'), {
        userId: user?.uid || 'guest',
        customerName: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        notes: form.notes,
        paymentMethod,
        items,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
      })

      if (user?.uid) {
        const { doc, updateDoc, increment } = await import('firebase/firestore')
        await updateDoc(doc(db, 'users', user.uid), {
          totalOrders: increment(1),
          totalSpent: increment(totalPrice),
        })
      }

      clearCart()
      setOrdered(true)
    } catch (err) {
      clearCart()
      setOrdered(true)
    }
  }

  if (ordered) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-black mb-3">
            Order Placed!
          </h1>
          <p className="text-gray-500 text-sm mb-2">Order ID: <span className="font-bold text-black">#{Math.floor(Math.random() * 90000) + 10000}</span></p>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Thank you <span className="font-bold text-black">{form.name}</span>! We will contact you on <span className="font-bold text-black">{form.phone}</span> to confirm your order.
          </p>
          <Link
            href="/shop"
            className="bg-black text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-4">Cart is Empty</h1>
          <Link href="/shop" className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition inline-block">
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  const isFormValid = form.name && form.phone && form.address && form.city

  // Account details for EasyPaisa & JazzCash
  const accountDetails = {
    easypaisa: {
      name: 'Khalid Mehmood',
      account: '03482444012',
      logo: (
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-black">EP</span>
        </div>
      )
    },
    jazzcash: {
      name: 'Rab Nawaz',
      account: '03073747306',
      logo: (
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-black">JC</span>
        </div>
      )
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">

        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

        <h1 className="text-4xl font-black uppercase tracking-tight text-black mb-2 mt-4">
          Checkout
        </h1>
        <p className="text-gray-400 text-sm mb-8">Complete your order in just a few steps</p>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left — Form */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Step 1 — Delivery Info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-black">
                  1
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-black">
                  Delivery Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Form fields... */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest mb-2 block text-gray-500">
                    Full Name *
                  </label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full border-2 border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm text-black outline-none focus:border-black transition placeholder-gray-300 font-medium bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest mb-2 block text-gray-500">
                    Phone *
                  </label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-1.62 1.012-3.007 2.504-3.618L4.5 2.625a1.875 1.875 0 012.625 1.72v.627a1.875 1.875 0 01-.615 1.403L5.625 7.5a16.458 16.458 0 006.375 6.375l1.125-1.125a1.875 1.875 0 011.403-.615h.627a1.875 1.875 0 011.72 2.625l-.095.754c-.611 1.492-1.998 2.504-3.618 2.504C8.516 18 3 12.484 3 5.625v-.75c0-.552.224-1.052.586-1.415" />
                    </svg>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="03XX-XXXXXXX"
                      className="w-full border-2 border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm text-black outline-none focus:border-black transition placeholder-gray-300 font-medium bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest mb-2 block text-gray-500">
                    Email
                  </label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full border-2 border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm text-black outline-none focus:border-black transition placeholder-gray-300 font-medium bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest mb-2 block text-gray-500">
                    City *
                  </label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm text-black outline-none focus:border-black transition font-medium bg-gray-50 appearance-none"
                    >
                      <option value="">Select City</option>
                      {['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Bahawalpur', 'Sialkot', 'Gujranwala', 'Hyderabad'].map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest mb-2 block text-gray-500">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 absolute left-4 top-4 text-gray-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="House no, Street, Area, City"
                      rows={3}
                      className="w-full border-2 border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm text-black outline-none focus:border-black transition placeholder-gray-300 font-medium bg-gray-50 resize-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest mb-2 block text-gray-500">
                    Order Notes (Optional)
                  </label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 absolute left-4 top-4 text-gray-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Any special instructions for delivery?"
                      rows={2}
                      className="w-full border-2 border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm text-black outline-none focus:border-black transition placeholder-gray-300 font-medium bg-gray-50 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 — Payment */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-black">
                  2
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-black">
                  Payment Method
                </h2>
              </div>

              <div className="flex flex-col gap-3">

                {/* COD */}
                <button
                  onClick={() => handlePaymentSelect('cod')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition ${
                    paymentMethod === 'cod'
                      ? 'border-black bg-gray-50'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'cod' ? 'border-black' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'cod' && (
                      <div className="w-2.5 h-2.5 bg-black rounded-full" />
                    )}
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-green-500 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
                  </svg>
                  <div className="text-left">
                    <p className="font-black text-black text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-400">Pay when your order arrives</p>
                  </div>
                  <span className="ml-auto text-xs bg-green-100 text-green-600 font-bold px-2 py-1 rounded-full">
                    COD
                  </span>
                </button>

                {/* EasyPaisa */}
                <button
                  onClick={() => handlePaymentSelect('easypaisa')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition ${
                    paymentMethod === 'easypaisa'
                      ? 'border-black bg-gray-50'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'easypaisa' ? 'border-black' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'easypaisa' && (
                      <div className="w-2.5 h-2.5 bg-black rounded-full" />
                    )}
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-black">EP</span>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-black text-sm">EasyPaisa</p>
                    <p className="text-xs text-gray-400">Pay via EasyPaisa mobile wallet</p>
                  </div>
                  <span className="ml-auto text-xs bg-green-100 text-green-600 font-bold px-2 py-1 rounded-full">
                    Online
                  </span>
                </button>

                {/* JazzCash */}
                <button
                  onClick={() => handlePaymentSelect('jazzcash')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition ${
                    paymentMethod === 'jazzcash'
                      ? 'border-black bg-gray-50'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'jazzcash' ? 'border-black' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'jazzcash' && (
                      <div className="w-2.5 h-2.5 bg-black rounded-full" />
                    )}
                  </div>
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-black">JC</span>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-black text-sm">JazzCash</p>
                    <p className="text-xs text-gray-400">Pay via JazzCash mobile wallet</p>
                  </div>
                  <span className="ml-auto text-xs bg-red-100 text-red-500 font-bold px-2 py-1 rounded-full">
                    Online
                  </span>
                </button>

                {/* Account Details - Show when EasyPaisa or JazzCash selected */}
                {showAccountDetails && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-2xl border-2 border-black">
                    <h4 className="text-xs font-black uppercase tracking-widest text-black mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                      Account Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                        <span className="text-xs text-gray-500">Account Holder</span>
                        <span className="text-xs font-bold text-black">
                          {paymentMethod === 'easypaisa' ? accountDetails.easypaisa.name : accountDetails.jazzcash.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5">
                        <span className="text-xs text-gray-500">
                          {paymentMethod === 'easypaisa' ? 'EasyPaisa Account' : 'JazzCash Account'}
                        </span>
                        <span className="text-xs font-bold text-black">
                          {paymentMethod === 'easypaisa' ? accountDetails.easypaisa.account : accountDetails.jazzcash.account}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3 text-center border-t border-gray-200 pt-3">
                      Please send payment to the above account and share screenshot on WhatsApp
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Right — Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm sticky top-24">

              <h2 className="text-sm font-black uppercase tracking-widest text-black mb-5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                Order Summary
              </h2>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-5">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hiddenshrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-black truncate uppercase">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Size: {item.selectedSize} * {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-black shrink-0">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-bold text-black">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-bold text-green-500">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Payment</span>
                  <span className="font-bold text-black capitalize">
                    {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'}
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-black pt-4 flex justify-between items-center mb-6">
                <span className="font-black text-base text-black uppercase">Total</span>
                <span className="font-black text-2xl text-black">
                  Rs. {totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleOrder}
                disabled={!isFormValid || (paymentMethod !== 'cod' && !showAccountDetails)}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
                  isFormValid && (paymentMethod === 'cod' || showAccountDetails)
                    ? 'bg-black text-white hover:bg-gray-800 active:scale-95'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {isFormValid && (paymentMethod === 'cod' || showAccountDetails) ? 'Place Order' : 'Fill Required Fields'}
              </button>

              {(!isFormValid || (paymentMethod !== 'cod' && !showAccountDetails)) && (
                <p className="text-xs text-red-400 text-center mt-2 flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {!isFormValid ? 'Please fill all required fields' : 'Please select payment method'}
                </p>
              )}

              <p className="text-xs text-gray-300 text-center mt-3">
                By placing order you agree to our Terms & Conditions
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}