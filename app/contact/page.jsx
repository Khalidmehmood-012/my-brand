'use client'

import { useState } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return
    setSubmitted(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contact' },
        ]}
      />

      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-4">
          Contact Us
        </h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          Have a question? We would love to hear from you. Send us a message and we will get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Left — Contact Info */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold uppercase tracking-widest">
            Get In Touch
          </h2>

          {[
            { icon: '📍', title: 'Address', info: 'Lahore, Pakistan' },
            { icon: '📞', title: 'Phone', info: '+92 300 1234567' },
            { icon: '📧', title: 'Email', info: 'support@mybrand.pk' },
            { icon: '🕐', title: 'Working Hours', info: 'Mon - Sat: 9am - 6pm' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center text-xl shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-widest mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.info}</p>
              </div>
            </div>
          ))}

          {/* Social */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-3">
              Follow Us
            </h3>
            <div className="flex gap-3">
              {['Facebook', 'Instagram', 'YouTube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="border border-gray-200 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-black hover:text-white hover:border-black transition"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Contact Form */}
        <div>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <p className="text-4xl mb-4">✅</p>
              <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
              <p className="text-gray-500 text-sm">
                Thank you for contacting us. We will get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setForm({ name: '', email: '', subject: '', message: '' })
                }}
                className="mt-6 bg-black text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
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

              {/* Email */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest mb-1 block">
                  Email Address *
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

              {/* Subject */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest mb-1 block">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest mb-1 block">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition"
              >
                Send Message 📩
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}