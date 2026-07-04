'use client'

import { useState } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Link from 'next/link'

export default function ReturnExchangePage() {
  const [form, setForm] = useState({
    orderId: '',
    name: '',
    email: '',
    phone: '',
    reason: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (!form.orderId || !form.name || !form.email || !form.reason) return
    setSubmitted(true)
  }

  const returnReasons = [
    'Wrong Size',
    'Wrong Item',
    'Damaged Product',
    'Defective Product',
    'Not Satisfied',
    'Other',
  ]

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Return & Exchange' },
          ]}
        />

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 bg-gray-100 px-4 py-2 rounded-full">
            Customer Support
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-3">
            Return & <span className="text-transparent bg-clip-text bg-linear-to-r from-black to-gray-600">Exchange</span>
          </h1>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
          <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
            We offer easy returns and exchanges within 7 days of delivery. Product must be unused and in original packaging.
          </p>
        </div>

        {/* Policy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="border-2 border-black rounded-2xl p-5 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            </div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-black mb-1">7 Days Return</h3>
            <p className="text-gray-400 text-xs">Easy returns within 7 days</p>
          </div>

          <div className="border-2 border-black rounded-2xl p-5 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
            </div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-black mb-1">Free Returns</h3>
            <p className="text-gray-400 text-xs">No additional charges</p>
          </div>

          <div className="border-2 border-black rounded-2xl p-5 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-black mb-1">Easy Exchange</h3>
            <p className="text-gray-400 text-xs">Exchange for different size/color</p>
          </div>
        </div>

        {/* Return Form */}
        <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border-2 border-black">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="font-black text-xl uppercase tracking-tight text-black mb-2">
                Request Submitted!
              </h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                We have received your request. Our team will contact you within 24 hours to process your return/exchange.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setForm({ orderId: '', name: '', email: '', phone: '', reason: '', message: '' })
                }}
                className="mt-6 bg-black text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-black mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Submit Return / Exchange Request
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Order ID */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                    Order ID *
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={form.orderId}
                    onChange={handleChange}
                    placeholder="e.g. MB-12345"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm text-black outline-none focus:border-black transition placeholder:text-gray-400 bg-white"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm text-black outline-none focus:border-black transition placeholder:text-gray-400 bg-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm text-black outline-none focus:border-black transition placeholder:text-gray-400 bg-white"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="03XX-XXXXXXX"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm text-black outline-none focus:border-black transition placeholder:text-gray-400 bg-white"
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="mt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                  Reason for Return / Exchange *
                </label>
                <select
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm text-black outline-none focus:border-black transition bg-white"
                >
                  <option value="">Select a reason</option>
                  {returnReasons.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="mt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                  Additional Details
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Please provide any additional details about your request..."
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm text-black outline-none focus:border-black transition placeholder:text-gray-400 bg-white resize-none"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full mt-6 bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Submit Request</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-3">
                * Required fields
              </p>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-black text-center mb-6">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: 'How many days do I have to return?',
                a: 'You can return or exchange items within 7 days of delivery.'
              },
              {
                q: 'Who pays for return shipping?',
                a: 'We offer free returns. We will arrange the pickup from your address.'
              },
              {
                q: 'What items can be returned?',
                a: 'Products must be unused, unwashed, and in original packaging with tags.'
              },
              {
                q: 'How long does the refund take?',
                a: 'Refunds are processed within 3-5 business days after we receive the product.'
              },
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-4 hover:border-black transition-all duration-300">
                <p className="font-bold text-xs uppercase tracking-widest text-black mb-1">{faq.q}</p>
                <p className="text-gray-500 text-xs">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}