export default function AnnouncementBar() {
  return (
    <div className="bg-black text-white text-center text-sm py-2 px-4">
      <p>
        🚚 Free Shipping on all orders above Rs. 2000 —{' '}
        <a href="/shop" className="underline font-semibold hover:text-gray-300">
          Shop Now
        </a>
      </p>
    </div>
  )
}