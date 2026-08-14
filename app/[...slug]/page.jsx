import Link from 'next/link'

export default async function FallbackPage({ params }) {
  const { slug } = await params
  const title = slug.at(-1).replaceAll('-', ' ')
  return <main className="flex min-h-[70vh] items-center justify-center bg-white px-4"><div className="max-w-lg text-center"><p className="text-xs font-black uppercase tracking-[.25em] text-gray-400">Komrez</p><h1 className="mt-3 text-4xl font-black capitalize">{title}</h1><p className="mt-3 text-gray-500">This section is being prepared. You can continue shopping or contact support for help.</p><div className="mt-6 flex justify-center gap-3"><Link href="/shop" className="rounded-xl bg-black px-6 py-3 text-sm font-bold text-white">Shop now</Link><Link href="/contact" className="rounded-xl border px-6 py-3 text-sm font-bold">Contact us</Link></div></div></main>
}
