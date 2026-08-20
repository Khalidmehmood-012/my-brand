'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getCustomerToken } from '@/lib/authStore'
import { enableCustomerPush } from '@/lib/pushNotifications'
import { createNotificationSocket } from '@/lib/notificationSocket'
import { toast } from '@/components/ui/ToastProvider'

let notificationAudio
function getNotificationAudio() { notificationAudio ||= Object.assign(new Audio('/sounds/notification.mp3'), { preload: 'auto', volume: 0.85 }); return notificationAudio }
function unlockChime() { try { const audio = getNotificationAudio(); audio.muted = true; void audio.play().then(() => { audio.pause(); audio.currentTime = 0; audio.muted = false }).catch(() => { audio.muted = false }) } catch {} }
function chime() { try { const audio = getNotificationAudio(); audio.muted = false; audio.currentTime = 0; void audio.play().catch(() => {}) } catch {} }
export default function NotificationBell({ user }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [enabling, setEnabling] = useState(false)
  const previous = useRef(0)
  const socketRef = useRef(null)
  const unread = items.filter((item) => !item.isRead).length
  useEffect(() => {
    const token = getCustomerToken()
    if (!user || !token) return
    const socket = createNotificationSocket(token)
    socketRef.current = socket
    socket.on('notifications:state', ({ items: nextItems, unread: count }) => { if (count > previous.current && previous.current > 0) chime(); previous.current = count; setItems(nextItems) })
    socket.on('notification:new', (item) => { setItems((current) => [item, ...current.filter((entry) => entry._id !== item._id)].slice(0, 30)); previous.current += 1; chime() })
    if ('Notification' in window) setTimeout(() => { const granted = Notification.permission === 'granted'; setPushEnabled(granted); if (granted && 'serviceWorker' in navigator) navigator.serviceWorker.register('/notification-sw.js').then((registration) => registration.update()).catch(() => {}) }, 0)
    return () => { socketRef.current = null; socket.close() }
  }, [user])
  useEffect(() => { const unlock = () => unlockChime(); window.addEventListener('pointerdown', unlock, { once: true }); window.addEventListener('keydown', unlock, { once: true }); return () => { window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock) } }, [])
  useEffect(() => { if (!('Notification' in window)) return; let previousPermission = Notification.permission; const refreshPermission = () => { const nextPermission = Notification.permission; if (previousPermission !== 'granted' && nextPermission === 'granted') window.location.reload(); previousPermission = nextPermission }; window.addEventListener('focus', refreshPermission); document.addEventListener('visibilitychange', refreshPermission); return () => { window.removeEventListener('focus', refreshPermission); document.removeEventListener('visibilitychange', refreshPermission) } }, [])
  useEffect(() => { if (!open) return; const close = (event) => { if (!event.target.closest('[data-notification-bell]')) setOpen(false) }; document.addEventListener('click', close); return () => document.removeEventListener('click', close) }, [open])
  if (!user) return null
  const enablePush = async () => { setEnabling(true); try { await enableCustomerPush(); setPushEnabled(true); toast('success', 'Browser notifications are enabled on this device.', 'Notifications enabled'); window.setTimeout(() => window.location.reload(), 500) } catch (error) { toast('error', error.message, 'Unable to enable notifications') } finally { setEnabling(false) } }
  const readOne = (id) => { setItems((current) => current.map((item) => item._id === id ? { ...item, isRead: true } : item)); socketRef.current?.emit('notifications:read', id) }
  const readAll = () => { setItems((current) => current.map((item) => ({ ...item, isRead: true }))); socketRef.current?.emit('notifications:read-all') }
  const load = () => socketRef.current?.emit('notifications:sync')
  return <div className="relative" data-notification-bell><button onClick={() => { setOpen((value) => !value); void load() }} aria-label="Notifications" className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition ${open ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-black hover:border-black'}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeWidth="1.8" strokeLinecap="round" d="M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>{unread > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white ring-2 ring-white">{unread}</span>}</button>{open && <div className="fixed inset-x-3 top-28 z-50 overflow-hidden rounded-3xl border border-gray-200 bg-white text-gray-950 shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-100"><div className="flex items-center justify-between border-b p-4"><div><b className="text-black">Notifications</b><p className="text-[10px] text-gray-500">Order and account updates</p></div>{unread > 0 && <button onClick={readAll} className="rounded-full bg-black px-3 py-1.5 text-[10px] font-black text-white">Mark all read</button>}</div>{!pushEnabled && <button disabled={enabling} onClick={enablePush} className="m-3 w-[calc(100%-1.5rem)] rounded-xl bg-gray-950 px-4 py-3 text-xs font-black text-white disabled:opacity-50">{enabling ? 'Enabling…' : 'Enable browser notifications'}</button>}<div className="max-h-96 overflow-y-auto">{items.length ? items.map((item) => <Link key={item._id} href={item.link || '/profile'} onClick={() => { readOne(item._id); setOpen(false) }} className={`relative block border-b p-4 pl-5 transition hover:bg-gray-50 ${!item.isRead ? 'bg-gray-50' : 'bg-white'}`}>{!item.isRead && <span className="absolute left-2 top-5 h-2 w-2 rounded-full bg-black" />}<p className="text-sm font-black text-black">{item.title}</p><p className="mt-1 text-xs leading-5 text-gray-600">{item.message}</p><p className="mt-2 text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleString()}</p></Link>) : <p className="p-8 text-center text-sm text-gray-500">You are all caught up.</p>}</div></div>}</div>
}
