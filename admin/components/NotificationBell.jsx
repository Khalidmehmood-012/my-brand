'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { API_URL, api, getToken } from '@/lib/api'

function chime() { try { const context = new AudioContext(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = 760; gain.gain.setValueAtTime(.06, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .25); oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .25) } catch {} }

export default function NotificationBell() {
  const [items, setItems] = useState([]), [open, setOpen] = useState(false)
  const previous = useRef(0)
  const unread = items.filter((item) => !item.isRead).length
  const load = useCallback(() => api('/notifications').then((payload) => { const count = payload.meta?.unread || 0; if (count > previous.current && previous.current > 0) chime(); previous.current = count; setItems(payload.data) }).catch(() => {}), [])
  useEffect(() => { const timeout = setTimeout(load, 0); const stream = new EventSource(`${API_URL}/notifications/stream?token=${encodeURIComponent(getToken())}`); stream.onmessage = (event) => { const item = JSON.parse(event.data); setItems((current) => [item, ...current.filter((entry) => entry._id !== item._id)].slice(0, 30)); chime() }; return () => { clearTimeout(timeout); stream.close() } }, [load])
  useEffect(() => { if (!open) return; const close = (event) => { if (!event.target.closest('[data-admin-notifications]')) setOpen(false) }; document.addEventListener('click', close); return () => document.removeEventListener('click', close) }, [open])
  const readOne = async (id) => { setItems((current) => current.map((item) => item._id === id ? { ...item, isRead: true } : item)); await api(`/notifications/${id}/read`, { method: 'PATCH' }).catch(() => {}) }
  const readAll = async () => { setItems((current) => current.map((item) => ({ ...item, isRead: true }))); await api('/notifications/read-all', { method: 'PATCH' }).catch(() => {}) }
  return <div className="relative" data-admin-notifications><button onClick={() => setOpen((value) => !value)} aria-label="Notifications" className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${open ? 'border-black bg-black text-white' : 'border-gray-200 bg-white hover:border-black'}`}><Bell size={18} />{unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[9px] font-bold text-white">{unread}</span>}</button>{open && <div className="fixed inset-x-3 top-20 z-100 overflow-hidden rounded-3xl border bg-white shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96"><div className="flex items-center justify-between border-b p-4"><div><p className="font-black">Notifications</p><p className="text-[10px] text-gray-400">Live store activity</p></div>{unread > 0 && <button onClick={readAll} className="rounded-full bg-black px-3 py-1.5 text-[10px] font-black text-white">Mark all read</button>}</div><div className="max-h-96 overflow-y-auto">{items.length ? items.map((item) => <Link key={item._id} href={item.link || '/orders'} onClick={() => { readOne(item._id); setOpen(false) }} className={`relative block border-b p-4 pl-6 transition hover:bg-gray-50 ${!item.isRead ? 'bg-gray-50' : 'bg-white'}`}>{!item.isRead && <span className="absolute left-3 top-5 h-2 w-2 rounded-full bg-black" />}<p className="text-sm font-black text-gray-950">{item.title}</p><p className="mt-1 text-xs leading-5 text-gray-500">{item.message}</p><p className="mt-2 text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleString()}</p></Link>) : <p className="p-7 text-center text-sm text-gray-400">No notifications yet.</p>}</div></div>}</div>
}
