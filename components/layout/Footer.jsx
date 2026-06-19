import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold tracking-widest uppercase mb-4">
            MyBrand
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Premium quality streetwear for everyone. Made in Pakistan 🇵🇰
          </p>
          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-white transition text-sm">
              Facebook
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition text-sm">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition text-sm">
              YouTube
            </a>
          </div>
        </div>

        {/* Information */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
            Information
          </h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/about" className="text-gray-400 hover:text-white text-sm transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/faqs" className="text-gray-400 hover:text-white text-sm transition">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Services */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
            Customer Services
          </h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="text-gray-400 hover:text-white text-sm transition">
                Track Order
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition">
                Return & Exchange
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
            Newsletter
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            Subscribe to get notified about new launches and offers.
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-800 text-white text-sm px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-black text-sm font-semibold py-2 rounded-xl hover:bg-gray-200 transition">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 text-center">
        <p className="text-gray-500 text-xs">
          © 2026 MyBrand. All rights reserved. Made with ❤️ in Pakistan
        </p>
      </div>
    </footer>
  )
}