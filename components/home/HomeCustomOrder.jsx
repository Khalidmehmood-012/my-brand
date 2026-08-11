import CustomOrder from '@/components/products/CustomOrder'

export default function HomeCustomOrder() {
  return (
    <section className="border-y border-stone-200 bg-stone-50 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <span className="inline-flex rounded-full border border-stone-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-gray-500">
              Made by you
            </span>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-[-0.04em] text-gray-950 md:text-5xl">
              Wear Your <span className="text-gray-400">Idea</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 md:text-base">
              Pick your fit, color and print. Upload your artwork and we’ll turn it into a shirt made especially for you.
            </p>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <div className="text-right">
              <p className="text-lg font-black text-gray-950">Rs. 2,500</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Starting price</p>
            </div>
            <div className="h-10 w-px bg-stone-300" />
            <div className="text-right">
              <p className="text-lg font-black text-gray-950">3–5 Days</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Processing</p>
            </div>
          </div>
        </div>

        <CustomOrder variant="home" />
      </div>
    </section>
  )
}
