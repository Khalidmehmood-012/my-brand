'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api, clearSession, getToken } from '@/lib/api'
import { LayoutDashboard, Package, ShoppingBag, Tags, Users, Settings, Menu, X, LogOut, Database, ReceiptText, ShieldAlert } from 'lucide-react'
import NotificationBell from './NotificationBell'
import { toast } from './ToastProvider'

const links = [
  ['Dashboard', '/dashboard', LayoutDashboard],
  ['Products', '/products', Package],
  ['Orders', '/orders', ShoppingBag],
  ['Damage claims', '/claims', ShieldAlert],
  ['Categories', '/categories', Tags],
  ['Users', '/users', Users],
  ['Settings', '/settings', Settings],
  ['Expenses', '/expenses', ReceiptText],
  ['Data migration', '/migration', Database],
]

export default function AdminShell({ title, description, actions, children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login')
      return
    }
    api('/auth/me')
      .then(({ data }) => {
        if (!['admin', 'staff'].includes(data.role)) throw new Error('Admin access required.')
        setUser(data)
        setReady(true)
      })
      .catch(() => {
        clearSession()
        router.replace('/login')
      })
  }, [router])

  if (!ready) return <div className="flex min-h-screen items-center justify-center"><span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" /></div>

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-950 p-5 text-white transition-transform duration-300 lg:static lg:w-auto lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/dashboard" className="text-xl font-black uppercase tracking-[0.18em]">Komrez<span className="text-gray-500">.</span></Link>
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="lg:hidden"><X size={20} /></button>
          </div>
          <nav className="space-y-1">
            {links.map(([label, href, Icon]) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${pathname === href ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}>
                <Icon size={18} strokeWidth={1.8} aria-hidden="true" />{label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/10 p-4">
            <p className="truncate text-sm font-bold">{user?.name}</p>
            <p className="truncate text-xs text-gray-500">{user?.email}</p>
            <button onClick={() => { clearSession(); router.replace('/login') }} className="mt-3 flex items-center gap-2 text-xs font-bold text-red-400"><LogOut size={14} />Sign out</button>
          </div>
        </div>
      </aside>

      {mobileOpen && <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/30 lg:hidden" />}

      <main className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-20 items-center gap-4 border-b border-gray-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <button aria-label="Open menu" onClick={() => setMobileOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 lg:hidden"><Menu size={20} /></button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-black text-gray-950 md:text-2xl">{title}</h1>
            {description && <p className="mt-0.5 text-xs text-gray-500 md:text-sm">{description}</p>}
          </div>
          {actions}
          <NotificationBell />
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}

export function Notice({ type = 'error', children }) {
  useEffect(() => { if (children) toast(type, String(children)) }, [children, type])
  return null
}

export function Empty({ children }) {
  return <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center text-sm text-gray-500">{children}</div>
}
