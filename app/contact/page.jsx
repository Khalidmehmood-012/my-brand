'use client'

import { useState } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Link from 'next/link'

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
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contact' },
          ]}
        />

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 bg-gray-100 px-4 py-2 rounded-full">
            Get In Touch
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-3">
            Let's <span className="text-transparent bg-clip-text bg-linear-to-r from-black to-gray-600">Connect</span>
          </h1>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
          <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
            Have a question? We would love to hear from you. Send us a message and we will get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left — Contact Info */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-black">
              Get In Touch
            </h2>
            <div className="w-10 h-0.5 bg-black" />

            {[
              { 
                icon: 'location',
                title: 'Address', 
                info: 'Lahore, Pakistan' 
              },
              { 
                icon: 'phone',
                title: 'Phone', 
                info: '+92 300 1234567' 
              },
              { 
                icon: 'email',
                title: 'Email', 
                info: 'support@komrez.pk' 
              },
              { 
                icon: 'time',
                title: 'Working Hours', 
                info: 'Mon - Sat: 9am - 6pm' 
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {item.icon === 'location' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  )}
                  {item.icon === 'phone' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-1.62 1.012-3.007 2.504-3.618L4.5 2.625a1.875 1.875 0 012.625 1.72v.627a1.875 1.875 0 01-.615 1.403L5.625 7.5a16.458 16.458 0 006.375 6.375l1.125-1.125a1.875 1.875 0 011.403-.615h.627a1.875 1.875 0 011.72 2.625l-.095.754c-.611 1.492-1.998 2.504-3.618 2.504C8.516 18 3 12.484 3 5.625v-.75c0-.552.224-1.052.586-1.415" />
                    </svg>
                  )}
                  {item.icon === 'email' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  )}
                  {item.icon === 'time' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-widest text-black mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.info}</p>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="mt-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-black mb-3">
                Follow Us
              </h3>
              <div className="flex gap-3">
                {[
                  { name: 'Facebook', icon: 'facebook' },
                  { name: 'Instagram', icon: 'instagram' },
                  { name: 'YouTube', icon: 'youtube' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="border-2 border-gray-200 text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div>
            {submitted ? (
              <div className="bg-gray-50 border-2 border-black rounded-3xl p-10 text-center">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-black text-xl uppercase tracking-tight text-black mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  Thank you for contacting us. We will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: '', email: '', subject: '', message: '' })
                  }}
                  className="mt-6 bg-black text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border-2 border-gray-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-black mb-6">
                  Send Us a Message
                </h3>
                <div className="flex flex-col gap-4">
                  {/* Name */}
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
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black transition placeholder:text-gray-300 bg-white"
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
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black transition placeholder:text-gray-300 bg-white"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black transition placeholder:text-gray-300 bg-white"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      rows={5}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black transition placeholder:text-gray-300 bg-white resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Send Message</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>

                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    * Required fields
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}