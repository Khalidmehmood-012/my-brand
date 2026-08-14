'use client'

import { useCallback, useEffect, useState } from 'react'
import AdminShell, { Empty, Notice } from '@/components/AdminShell'
import { api } from '@/lib/api'
import { useAdminModal } from '@/components/ModalProvider'

const statuses = ['submitted', 'reviewing', 'approved', 'rejected', 'resolved']
export default function ClaimsPage() {
  const { prompt } = useAdminModal()
  const [claims, setClaims] = useState([]), [error, setError] = useState('')
  const load = useCallback(() => api('/claims').then(({ data }) => setClaims(data)).catch((requestError) => setError(requestError.message)), [])
  useEffect(() => { load() }, [load])
  const review = async (id, status) => { const adminNote = await prompt({ title: `Set claim to ${status}`, message: 'This review note will be sent to the customer.', label: 'Review note (optional)', confirmText: 'Update claim', tone: status === 'rejected' ? 'danger' : 'default' }); if (adminNote === null) return; try { await api(`/claims/${id}`, { method: 'PATCH', body: JSON.stringify({ status, adminNote }) }); await load() } catch (requestError) { setError(requestError.message) } }
  return <AdminShell title="Damage claims" description="Review damaged-item reports without returning damaged units to sellable stock.">{error && <Notice>{error}</Notice>}<div className="mt-4 space-y-4">{claims.map((claim) => <article key={claim._id} className="rounded-2xl border bg-white p-5"><div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs font-bold text-gray-400">{claim.orderNumber}</p><h2 className="font-black">{claim.itemName}</h2><p className="mt-1 text-xs text-gray-500">{claim.user?.name} · {claim.user?.email}</p></div><select value={claim.status} onChange={(e) => review(claim._id, e.target.value)} className="h-10 rounded-xl border px-3 text-xs font-bold capitalize">{statuses.map((status) => <option key={status}>{status}</option>)}</select></div><p className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">{claim.reason}</p>{claim.adminNote && <p className="mt-3 text-xs text-gray-500">Admin note: {claim.adminNote}</p>}</article>)}{!claims.length && <Empty>No damage claims.</Empty>}</div></AdminShell>
}
