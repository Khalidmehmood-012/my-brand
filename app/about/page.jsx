import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 bg-gray-100 px-4 py-2 rounded-full">
            About Komrez
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-black mt-4">
            Who We Are
          </h1>
          <div className="w-12 h-0.5 bg-black mx-auto mt-4" />
          <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed mt-4">
            We are a Pakistani streetwear brand passionate about quality, style, and self-expression.
          </p>
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
          <div className="relative rounded-2xl overflow-hidden aspect-square bg-black order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop"
              alt="Brand Story"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                Since 2024
              </span>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              Our Story
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black mt-2">
              Built for the <span className="text-transparent bg-clip-text bg-linear-to-r from-black to-gray-600">Streets</span>
            </h2>
            <div className="w-10 h-0.5 bg-black mt-4" />
            <p className="text-gray-500 text-sm leading-relaxed mt-4">
              Komrez was founded with a simple mission — to bring premium quality streetwear to Pakistan at an affordable price. We believe that style should not be a luxury.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mt-3">
              Every piece we make is crafted with care, using the finest fabrics sourced locally. We are proud to be Made in Pakistan 🇵🇰
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 mt-6 text-sm font-bold uppercase tracking-widest text-black hover:text-gray-500 transition-colors"
            >
              Explore Our Collection
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              What Drives Us
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black mt-2">
              Our Core Values
            </h2>
            <div className="w-10 h-0.5 bg-black mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: 'mission',
                title: 'Our Mission',
                desc: 'To make premium streetwear accessible to everyone in Pakistan.',
              },
              {
                icon: 'vision',
                title: 'Our Vision',
                desc: 'To become the most loved Pakistani streetwear brand globally.',
              },
              {
                icon: 'values',
                title: 'Our Values',
                desc: 'Quality, Authenticity, and Customer First — always.',
              },
            ].map((item) => (
              <div 
                key={item.title} 
                className="border-2 border-black rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.icon === 'mission' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  )}
                  {item.icon === 'vision' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {item.icon === 'values' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-black uppercase tracking-widest text-sm text-black mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-black rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-2 border-white/10">
          {[
            { number: '500+', label: 'Happy Customers', icon: 'customers' },
            { number: '50+', label: 'Products', icon: 'products' },
            { number: '3+', label: 'Years', icon: 'years' },
            { number: '🇵🇰', label: 'Made in Pakistan', icon: 'flag' },
          ].map((stat) => (
            <div key={stat.label} className="group">
              <div className="flex items-center justify-center mb-2">
                {stat.icon === 'customers' && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white/30 group-hover:text-white/60 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                )}
                {stat.icon === 'products' && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white/30 group-hover:text-white/60 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                )}
                {stat.icon === 'years' && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white/30 group-hover:text-white/60 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                )}
                {stat.icon === 'flag' && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white/30 group-hover:text-white/60 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18m0-18h18m-9 0v18M3 12h18M3 6h18M3 18h18" />
                  </svg>
                )}
              </div>
              <p className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform">
                {stat.number}
              </p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}