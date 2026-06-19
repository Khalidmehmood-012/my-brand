'use client'

import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (!email) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="bg-black text-white py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-3">
          Stay In The Loop
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Subscribe to get notified about new launches, special offers and exclusive deals.
        </p>

        {/* Input */}
        {subscribed ? (
          <div className="bg-white text-black rounded-xl px-6 py-4 font-semibold text-sm">
            ✅ Thank you for subscribing!
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-gray-800 text-white text-sm px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
            />
            <button
              onClick={handleSubscribe}
              className="bg-white text-black text-sm font-bold px-8 py-3 rounded-xl hover:bg-gray-200 transition uppercase tracking-widest"
            >
              Subscribe
            </button>
          </div>
        )}

      </div>
    </section>
  )
}