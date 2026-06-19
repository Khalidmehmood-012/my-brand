'use client'

import useCartStore from '@/lib/store'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const increaseQty = useCartStore((state) => state.increaseQty)
  const decreaseQty = useCartStore((state) => state.decreaseQty)
  const clearCart = useCartStore((state) => state.clearCart)

  const totalPrice = items.reduce(
    (total, i) => total + i.price * i.quantity,
    0
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cart' },
        ]}
      />

      <h1 className="text-3xl font-bold uppercase tracking-widest mb-8">
        Your Cart 🛒
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🛒</p>
          <p className="text-gray-400 mb-6">Your cart is empty</p>
          <Link
            href="/shop"
            className="bg-black text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}`}
                className="flex gap-4 border border-gray-200 rounded-2xl p-4"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Size: {item.selectedSize}
                  </p>
                  <p className="text-sm font-bold mt-1">
                    Rs. {item.price * item.quantity}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => decreaseQty(item.id, item.selectedSize)}
                      className="w-8 h-8 border rounded-full text-sm hover:bg-gray-100 transition"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item.id, item.selectedSize)}
                      className="w-8 h-8 border rounded-full text-sm hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id, item.selectedSize)}
                  className="text-gray-400 hover:text-red-500 transition self-start text-lg"
                >
                  🗑️
                </button>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 transition self-start underline"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="border border-gray-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">Rs. {totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-500">Shipping</span>
                <span className="font-semibold text-green-500">Free</span>
              </div>

              <div className="border-t pt-4 mt-4 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">Rs. {totalPrice}</span>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-black text-white text-center py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition mt-6"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/shop"
                className="block w-full border border-black text-black text-center py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-100 transition mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}