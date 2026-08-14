'use client'

import { useEffect, useState } from 'react'

export function toast(type, message, title) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('komrez-toast', { detail: { type, message, title } }))
}

export default function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  useEffect(() => { const listener = (event) => { const item = { id: crypto.randomUUID(), ...event.detail }; setItems((current) => [...current, item]); setTimeout(() => setItems((current) => current.filter((entry) => entry.id !== item.id)), 4200) }; window.addEventListener('komrez-toast', listener); return () => window.removeEventListener('komrez-toast', listener) }, [])
  const remove = (id) => setItems((current) => current.filter((item) => item.id !== id))
  return <>{children}<div className="pointer-events-none fixed inset-x-3 top-4 z-120 flex flex-col items-end gap-3 sm:left-auto sm:right-5 sm:w-96">{items.map((item) => <Toast key={item.id} item={item} remove={remove} />)}</div></>
}

function Toast({ item, remove }) { const styles = { success: ['bg-emerald-500', '✓', 'Success'], error: ['bg-red-500', '!', 'Something went wrong'], warning: ['bg-amber-500', '!', 'Please check'], info: ['bg-gray-950', 'i', 'Update'] }; const [color, icon, fallback] = styles[item.type] || styles.info; return <button onClick={() => remove(item.id)} className="pointer-events-auto flex w-full animate-[toast-in_.3s_ease-out] items-start gap-3 overflow-hidden rounded-2xl border border-black/10 bg-white p-4 text-left text-gray-950 shadow-2xl"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white ${color}`}>{icon}</span><span className="min-w-0 flex-1"><b className="block text-sm font-black">{item.title || fallback}</b><span className="mt-1 block text-xs leading-5 text-gray-600">{item.message}</span></span><span className="text-lg text-gray-300">×</span></button> }
