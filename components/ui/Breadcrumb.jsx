import Link from 'next/link'

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index !== 0 && <span>/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-black transition"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-black font-semibold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}