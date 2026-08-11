import Link from 'next/link'

export default function MegaMenu({ item, onMouseEnter, onMouseLeave }) {
  const hasImages = Boolean(item.images?.length)

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute left-0 right-0 top-full hidden border-y border-gray-200 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.14)] lg:block"
    >
      <div className={`mx-auto grid max-w-7xl gap-10 px-8 py-8 ${hasImages ? 'grid-cols-[minmax(0,1fr)_360px]' : 'grid-cols-1'}`}>
        <div className={`grid gap-10 ${
          item.columns.length >= 3
            ? 'grid-cols-3'
            : item.columns.length === 2
              ? 'grid-cols-2'
              : 'max-w-xs grid-cols-1'
        }`}>
          {item.columns.map((column) => (
            <div key={column.heading} className="min-w-0">
              <h3 className="border-b border-gray-200 pb-3 text-[10px] font-black uppercase tracking-[0.22em] text-gray-950">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex w-fit items-center gap-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-gray-500 transition hover:translate-x-1 hover:text-black"
                    >
                      {link.name}
                      {link.badge && (
                        <span className={`rounded-full px-2 py-0.5 text-[8px] font-black tracking-wider text-white ${
                          link.badge === 'HOT'
                            ? 'bg-orange-500'
                            : link.badge === 'NEW'
                              ? 'bg-red-500'
                              : 'bg-black'
                        }`}>
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {hasImages && (
          <div className={`grid gap-3 ${item.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {item.images.map((image) => (
              <Link
                key={`${image.src}-${image.label}`}
                href={image.href}
                className="group relative h-48 overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-black/5"
              >
                <img
                  src={image.src}
                  alt={image.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 text-white">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em]">{image.label}</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
