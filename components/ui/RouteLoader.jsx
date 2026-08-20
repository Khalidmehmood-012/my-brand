'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function RouteLoader() {
  const pathname = usePathname()
  const search = useSearchParams()
  // Starts visible on a fresh document load; the persistent layout keeps it hidden
  // afterwards until a real internal navigation begins.
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    let timeout
    const finish = () => { timeout = setTimeout(() => setVisible(false), 650) }
    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })
    return () => { window.removeEventListener('load', finish); clearTimeout(timeout) }
  }, [pathname, search])
  useEffect(() => {
    const start = (event) => {
      const link = event.target.closest('a[href]')
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return
      const url = new URL(link.href, window.location.href)
      if (url.origin === window.location.origin && `${url.pathname}${url.search}` !== `${window.location.pathname}${window.location.search}`) setVisible(true)
    }
    const reset = () => { const timeout = setTimeout(() => setVisible(false), 350); return () => clearTimeout(timeout) }
    document.addEventListener('click', start, true)
    window.addEventListener('pageshow', reset)
    return () => { document.removeEventListener('click', start, true); window.removeEventListener('pageshow', reset) }
  }, [])
  if (!visible) return null
  return <div id="__initial-loader" className="fixed inset-0 z-150 flex items-center justify-center bg-white/92 backdrop-blur-md" role="status" aria-live="polite"><div className="text-center"><div className="relative mx-auto h-16 w-16"><span className="absolute inset-0 animate-ping rounded-full border border-black/15" /><span className="absolute inset-1 animate-spin rounded-full border-2 border-gray-200 border-t-black" /><span className="absolute inset-0 flex items-center justify-center text-xs font-black">K</span></div><p className="mt-5 text-xs font-black uppercase tracking-[.28em] text-black">Loading</p><div className="mx-auto mt-2 h-0.5 w-24 overflow-hidden bg-gray-100"><span className="block h-full w-1/2 animate-[loader-slide_.8s_ease-in-out_infinite] bg-black" /></div></div></div>
}
