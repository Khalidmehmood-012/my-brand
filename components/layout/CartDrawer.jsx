'use client'

import useCartStore from '@/lib/store'
import Link from 'next/link'

export default function CartDrawer({ open, onClose }) {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const increaseQty = useCartStore((state) => state.increaseQty)
  const decreaseQty = useCartStore((state) => state.decreaseQty)

  const totalPrice = items.reduce(
    (total, i) => total + i.price * i.quantity,
    0
  )

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold uppercase tracking-wide text-black flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            Your Cart
            {items.length > 0 && (
              <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex flex-col gap-4 p-4 overflow-y-auto h-[calc(100%-180px)]">
          {items.length === 0 ? (
            <div className="text-center mt-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
              </div>
              <p className="text-black font-semibold mb-1">Your cart is empty</p>
              <p className="text-gray-400 text-xs mb-4">Add items to get started</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="inline-block bg-black text-white text-sm px-6 py-2 rounded-xl hover:bg-gray-800 transition"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}`}
                className="flex gap-3 border-b border-gray-100 pb-4"
              >
                {/* Image */}
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black leading-tight">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Size: <span className="font-semibold text-black">{item.selectedSize}</span>
                  </p>
                  <p className="text-sm font-bold text-black mt-1">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQty(item.id, item.selectedSize)}
                      className="w-6 h-6 border border-gray-300 rounded-full text-sm text-black hover:bg-gray-100 transition flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold text-black">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id, item.selectedSize)}
                      className="w-6 h-6 border border-gray-300 rounded-full text-sm text-black hover:bg-gray-100 transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id, item.selectedSize)}
                  className="text-gray-300 hover:text-red-500 transition self-start mt-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-semibold text-black">Total:</span>
              <span className="text-sm font-bold text-black">Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full bg-black text-white text-center py-3 rounded-xl font-semibold hover:bg-gray-800 transition text-sm uppercase tracking-widest"
            >
              View Cart & Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  )
}