export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">

      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-4">
          About Us
        </h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
          We are a Pakistani streetwear brand passionate about quality, style, and self-expression.
        </p>
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
        <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
          <p className="text-gray-400 text-sm">Brand Image</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">
            Our Story
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            MyBrand was founded with a simple mission — to bring premium quality streetwear to Pakistan at an affordable price. We believe that style should not be a luxury.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Every piece we make is crafted with care, using the finest fabrics sourced locally. We are proud to be Made in Pakistan 🇵🇰
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {[
          { icon: '🎯', title: 'Our Mission', desc: 'To make premium streetwear accessible to everyone in Pakistan.' },
          { icon: '👁️', title: 'Our Vision', desc: 'To become the most loved Pakistani streetwear brand globally.' },
          { icon: '❤️', title: 'Our Values', desc: 'Quality, Authenticity, and Customer First — always.' },
        ].map((item) => (
          <div key={item.title} className="border border-gray-200 rounded-2xl p-6 text-center">
            <p className="text-4xl mb-3">{item.icon}</p>
            <h3 className="font-bold uppercase tracking-widest text-sm mb-2">{item.title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-black text-white rounded-2xl p-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { number: '500+', label: 'Happy Customers' },
          { number: '50+', label: 'Products' },
          { number: '3+', label: 'Years Experience' },
          { number: '🇵🇰', label: 'Made in Pakistan' },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold mb-1">{stat.number}</p>
            <p className="text-gray-400 text-xs uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

    </div>
  )
}