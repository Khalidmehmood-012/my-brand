'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { API_URL } from '@/lib/backend'
import { getCustomerToken } from '@/lib/authStore'

function chime() { try { const context = new AudioContext(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = 720; gain.gain.setValueAtTime(.06, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .25); oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .25) } catch {} }
const headers = () => ({ Authorization: `Bearer ${getCustomerToken()}` })

export default function NotificationBell({ user }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const previous = useRef(0)
  const unread = items.filter((item) => !item.isRead).length
  const load = useCallback(async () => { const token = getCustomerToken(); if (!token) return; try { const response = await fetch(`${API_URL}/notifications`, { headers: headers() }); const payload = await response.json(); if (!response.ok) return; const count = payload.meta?.unread || 0; if (count > previous.current && previous.current > 0) chime(); previous.current = count; setItems(payload.data) } catch {} }, [])
  useEffect(() => { if (!user) return; const timeout = setTimeout(load, 0); const stream = new EventSource(`${API_URL}/notifications/stream?token=${encodeURIComponent(getCustomerToken())}`); stream.onmessage = (event) => { const item = JSON.parse(event.data); setItems((current) => [item, ...current.filter((entry) => entry._id !== item._id)].slice(0, 30)); chime() }; return () => { clearTimeout(timeout); stream.close() } }, [user, load])
  useEffect(() => { if (!open) return; const close = (event) => { if (!event.target.closest('[data-notification-bell]')) setOpen(false) }; document.addEventListener('click', close); return () => document.removeEventListener('click', close) }, [open])
  if (!user) return null
  const readOne = async (id) => { setItems((current) => current.map((item) => item._id === id ? { ...item, isRead: true } : item)); await fetch(`${API_URL}/notifications/${id}/read`, { method: 'PATCH', headers: headers() }).catch(() => {}) }
  const readAll = async () => { setItems((current) => current.map((item) => ({ ...item, isRead: true }))); await fetch(`${API_URL}/notifications/read-all`, { method: 'PATCH', headers: headers() }).catch(() => {}) }
  return <div className="relative" data-notification-bell><button onClick={() => setOpen((value) => !value)} aria-label="Notifications" className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition ${open ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-black hover:border-black'}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeWidth="1.8" strokeLinecap="round" d="M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>{unread > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white ring-2 ring-white">{unread}</span>}</button>{open && <div className="fixed inset-x-3 top-28 z-50 overflow-hidden rounded-3xl border border-gray-200 bg-white text-gray-950 shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-100"><div className="flex items-center justify-between border-b p-4"><div><b className="text-black">Notifications</b><p className="text-[10px] text-gray-500">Live order updates</p></div>{unread > 0 && <button onClick={readAll} className="rounded-full bg-black px-3 py-1.5 text-[10px] font-black text-white">Mark all read</button>}</div><div className="max-h-96 overflow-y-auto">{items.length ? items.map((item) => <Link key={item._id} href={item.link || '/profile'} onClick={() => { readOne(item._id); setOpen(false) }} className={`relative block border-b p-4 pl-5 transition hover:bg-gray-50 ${!item.isRead ? 'bg-gray-50' : 'bg-white'}`}>{!item.isRead && <span className="absolute left-2 top-5 h-2 w-2 rounded-full bg-black" />}<p className="text-sm font-black text-black">{item.title}</p><p className="mt-1 text-xs leading-5 text-gray-600">{item.message}</p><p className="mt-2 text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleString()}</p></Link>) : <p className="p-8 text-center text-sm text-gray-500">You are all caught up.</p>}</div></div>}</div>
}
