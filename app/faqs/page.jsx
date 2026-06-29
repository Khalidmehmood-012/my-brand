'use client'

import { useState } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Link from 'next/link'

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'How long does delivery take?',
      answer: 'We deliver within 3-5 working days across Pakistan. Express delivery is available in major cities within 1-2 days.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer easy returns and exchanges within 7 days of delivery. Product must be unused and in original packaging.',
    },
    {
      question: 'Do you offer Cash on Delivery?',
      answer: 'Yes! We offer Cash on Delivery (COD) all across Pakistan. No advance payment required.',
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking number via SMS and email. You can track your order on our Track Order page.',
    },
    {
      question: 'Are your sizes true to fit?',
      answer: 'Yes, our sizes are standard Pakistani sizes. We recommend checking our size guide on each product page for the best fit.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently we only ship within Pakistan. International shipping will be available soon!',
    },
    {
      question: 'How do I cancel my order?',
      answer: 'You can cancel your order within 24 hours of placing it by contacting us on WhatsApp or email.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Cash on Delivery, EasyPaisa, JazzCash, and bank transfers.',
    },
  ]

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'FAQs' },
          ]}
        />

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 bg-gray-100 px-4 py-2 rounded-full">
            Help Center
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-3">
            Frequently Asked <span className="text-transparent bg-clip-text bg-linear-to-r from-black to-gray-600">Questions</span>
          </h1>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
          <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
            Find answers to the most common questions about our products and services.
          </p>
        </div>

        {/* FAQ List */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-black transition-all duration-300 bg-white"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-5 md:px-6 py-4 text-left hover:bg-gray-50 transition group"
              >
                <span className="font-bold text-sm text-black uppercase tracking-wide">
                  {faq.question}
                </span>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ml-4 ${
                  openIndex === index 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-500 group-hover:bg-black group-hover:text-white'
                }`}>
                  {openIndex === index ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  )}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-5 md:px-6 pb-5 pt-1 border-t-2 border-gray-100 bg-gray-50/50">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 bg-black rounded-3xl p-8 md:p-10 text-center border-2 border-white/10">
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white/60">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0a9 9 0 01-12.728 0m12.728 0A9 9 0 015.636 5.636m12.728 0A9 9 0 015.636 18.364M12 8.25v6.75m-4.5-6.75h9" />
            </svg>
          </div>
          <h3 className="font-black text-xl uppercase tracking-tight text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">
            Our support team is always here to help you. Reach out to us anytime.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gray-100 transition-all duration-300 hover:scale-105"
          >
            <span>Contact Us</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  )
}