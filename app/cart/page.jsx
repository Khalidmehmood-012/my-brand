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
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cart' },
          ]}
        />

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-5xl font-black uppercase tracking-tight text-black">
            Your Cart
          </h1>
          {items.length > 0 && (
            <p className="text-gray-400 text-sm mt-1">
              {items.length} item{items.length > 1 ? 's' : ''} in your cart
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-14 h-14 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </div>
            <p className="text-black font-black text-3xl mb-2 uppercase tracking-tight">
              Nothing here yet!
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Looks like you haven't added anything to your cart.
            </p>
            <Link
              href="/shop"
              className="bg-black text-white px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Cart Items */}
            <div className="flex-1 flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex gap-5 p-5 bg-white border border-gray-100 rounded-3xl hover:shadow-md transition-shadow duration-200"
                >
                  {/* Image */}
                  <div className="w-28 h-28 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-black text-base text-black uppercase tracking-wide leading-tight">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400 uppercase tracking-widest">Size:</span>
                      <span className="text-xs font-bold text-black bg-gray-100 px-2 py-0.5 rounded-full">
                        {item.selectedSize}
                      </span>
                    </div>
                    <p className="text-xl font-black text-black mt-2">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => decreaseQty(item.id, item.selectedSize)}
                        className="w-8 h-8 border-2 border-gray-200 rounded-full text-black font-bold hover:border-black hover:bg-black hover:text-white transition flex items-center justify-center text-lg"
                      >
                        −
                      </button>
                      <span className="text-base font-black text-black w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id, item.selectedSize)}
                        className="w-8 h-8 border-2 border-gray-200 rounded-full text-black font-bold hover:border-black hover:bg-black hover:text-white transition flex items-center justify-center text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id, item.selectedSize)}
                    className="text-gray-200 hover:text-red-500 transition self-start mt-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="text-sm text-red-400 hover:text-red-600 transition self-start flex items-center gap-1 mt-2 font-semibold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="border border-gray-100 rounded-3xl p-8 bg-white shadow-sm sticky top-24">

                <h2 className="text-xl font-black uppercase tracking-widest text-black mb-6">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Subtotal</span>
                    <span className="font-bold text-black text-sm">
                      Rs. {totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Shipping</span>
                    <span className="font-bold text-green-500 text-sm">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Discount</span>
                    <span className="font-bold text-red-400 text-sm">— Rs. 0</span>
                  </div>
                </div>

                <div className="border-t-2 border-black pt-4 flex justify-between items-center mb-6">
                  <span className="font-black text-lg text-black uppercase">Total</span>
                  <span className="font-black text-2xl text-black">
                    Rs. {totalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Free shipping notice */}
                {totalPrice < 2000 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-xs text-yellow-700 font-semibold">
                    🚚 Add Rs. {(2000 - totalPrice).toLocaleString()} more for FREE shipping!
                  </div>
                )}
                {totalPrice >= 2000 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-xs text-green-700 font-semibold">
                    ✅ You qualify for FREE shipping!
                  </div>
                )}

                <Link
                  href="/checkout"
                  className="block w-full bg-black text-white text-center py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition mb-3"
                >
                  Proceed to Checkout →
                </Link>

                <Link
                  href="/shop"
                  className="block w-full border-2 border-gray-100 text-gray-400 text-center py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:border-black hover:text-black transition"
                >
                  Continue Shopping
                </Link>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}