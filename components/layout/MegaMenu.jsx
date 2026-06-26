import Link from 'next/link'

export default function MegaMenu({ item, onMouseEnter, onMouseLeave }) {
  const hasImages = item.images && item.images.length > 0
  const columnCount = item.columns.length

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-50"
      style={{ top: '100px' }}
    >
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex gap-12">

          {/* Columns */}
          {item.columns.map((col, index) => (
            <div
              key={index}
              className={`flex flex-col gap-3 ${
                columnCount === 1
                  ? 'min-w-30'
                  : columnCount === 2
                  ? 'min-w-37.5'
                  : 'min-w-40'
              }`}
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-2">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-500 hover:text-black uppercase tracking-wide transition flex items-center gap-2"
                    >
                      {link.name}
                      {link.badge && (
                        <span className={`text-white text-[10px] px-1.5 py-0.5 rounded-full ${
                          link.badge === 'HOT' ? 'bg-orange-500' :
                          link.badge === 'NEW' ? 'bg-red-500' :
                          'bg-black'
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

          {/* Images — sirf tab show hongi jab images array empty na ho */}
          {hasImages && (
            <div className="ml-auto flex gap-3">
              {item.images.map((img, index) => (
                <Link key={index} href={img.href}>
                  <div className={`rounded-xl overflow-hidden bg-gray-100 relative group ${
                    item.images.length === 1
                      ? 'w-48 h-56'
                      : 'w-36 h-44'
                  }`}>
                    <img
                      src={img.src}
                      alt={img.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs font-bold uppercase tracking-widest text-center py-2">
                      {img.label}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

