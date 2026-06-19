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
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold uppercase tracking-wide">
            Your Cart 🛒
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex flex-col gap-4 p-4 overflow-y-auto h-[calc(100%-180px)]">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-4xl mb-3">🛒</p>
              <p className="text-sm">Your cart is empty</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-4 inline-block bg-black text-white text-sm px-6 py-2 rounded-xl hover:bg-gray-800 transition"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}`}
                className="flex gap-3 border-b pb-4"
              >
                {/* Image */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden -shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    Size: {item.selectedSize}
                  </p>
                  <p className="text-sm font-bold mt-1">
                    Rs. {item.price * item.quantity}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQty(item.id, item.selectedSize)}
                      className="w-6 h-6 border rounded-full text-sm hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id, item.selectedSize)}
                      className="w-6 h-6 border rounded-full text-sm hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id, item.selectedSize)}
                  className="text-gray-400 hover:text-red-500 text-sm self-start"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-semibold">Total:</span>
              <span className="text-sm font-bold">Rs. {totalPrice}</span>
            </div>
            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full bg-black text-white text-center py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              View Cart & Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  )
}