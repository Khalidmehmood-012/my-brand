export default function AnnouncementBar() {
  return (
    <div className="bg-black text-white text-center text-sm py-2.5 px-4 border-b border-white/10">
      <p className="tracking-wide">
        Free Shipping on all orders above Rs. 2000 —{' '}
        <a href="/shop" className="font-bold uppercase tracking-wider hover:text-gray-300 transition-colors duration-200 underline-offset-2 hover:underline">
          Shop Now
        </a>
      </p>
    </div>
  )
}