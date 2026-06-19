'use client'

import { useState } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'

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
    <div className="max-w-3xl mx-auto px-4 py-16">

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'FAQs' },
        ]}
      />

      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-4">
          FAQs
        </h1>
        <p className="text-gray-500 text-sm">
          Frequently asked questions — find your answers here.
        </p>
      </div>

      {/* FAQ List */}
      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-sm uppercase tracking-wide">
                {faq.question}
              </span>
              <span className="text-xl font-bold text-gray-400">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-500 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Still have questions */}
      <div className="mt-12 bg-black text-white rounded-2xl p-8 text-center">
        <h3 className="font-bold text-lg uppercase tracking-widest mb-2">
          Still have questions?
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Our support team is always here to help you.
        </p>
        <a
          href="/contact"
          className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition inline-block"
        >
          Contact Us
        </a>
      </div>

    </div>
  )
}