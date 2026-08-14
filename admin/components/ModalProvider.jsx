'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

const ModalContext = createContext(null)

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null)
  const close = useCallback((value) => { setModal((current) => { if (current) queueMicrotask(() => current.resolve(value)); return null }) }, [])
  useEffect(() => { if (!modal) return; const onKey = (event) => { if (event.key === 'Escape') close(modal.kind === 'prompt' ? null : false) }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [modal, close])
  const confirm = useCallback((options) => new Promise((resolve) => setModal({ kind: 'confirm', title: options.title || 'Confirm action', message: options.message, confirmText: options.confirmText || 'Confirm', tone: options.tone || 'danger', resolve })), [])
  const prompt = useCallback((options) => new Promise((resolve) => setModal({ kind: 'prompt', title: options.title || 'Add note', message: options.message, label: options.label || 'Note', value: options.defaultValue || '', placeholder: options.placeholder || '', confirmText: options.confirmText || 'Continue', tone: options.tone || 'default', resolve })), [])
  return <ModalContext.Provider value={{ confirm, prompt }}>{children}{modal && <Modal modal={modal} close={close} />}</ModalContext.Provider>
}

export function useAdminModal() { const value = useContext(ModalContext); if (!value) throw new Error('useAdminModal must be used inside ModalProvider'); return value }

function Modal({ modal, close }) {
  const [value, setValue] = useState(modal.value || '')
  const danger = modal.tone === 'danger'
  return <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title"><button aria-label="Close modal" className="absolute inset-0 cursor-default" onClick={() => close(modal.kind === 'prompt' ? null : false)} /><div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"><div className="flex items-start gap-4 p-6"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${danger ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-black'}`}><AlertTriangle size={21} /></div><div className="min-w-0 flex-1"><h2 id="admin-modal-title" className="text-xl font-black text-gray-950">{modal.title}</h2>{modal.message && <p className="mt-2 text-sm leading-6 text-gray-600">{modal.message}</p>}</div><button onClick={() => close(modal.kind === 'prompt' ? null : false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-black" aria-label="Close"><X size={18} /></button></div>{modal.kind === 'prompt' && <label className="block px-6 pb-5 text-xs font-black uppercase tracking-wide text-gray-600">{modal.label}<textarea autoFocus rows={4} value={value} onChange={(event) => setValue(event.target.value)} placeholder={modal.placeholder} className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium normal-case text-gray-950 outline-none focus:border-black focus:ring-2 focus:ring-gray-100" /></label>}<div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4"><button onClick={() => close(modal.kind === 'prompt' ? null : false)} className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-black uppercase text-gray-700">Cancel</button><button onClick={() => close(modal.kind === 'prompt' ? value : true)} className={`rounded-xl px-5 py-2.5 text-xs font-black uppercase text-white ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-800'}`}>{modal.confirmText}</button></div></div></div>
}
