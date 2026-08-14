'use client'

import { useRef, useState } from 'react'
import { DatabaseBackup, Download, Upload, ShieldCheck } from 'lucide-react'
import AdminShell, { Notice } from '@/components/AdminShell'
import { api } from '@/lib/api'
import { useAdminModal } from '@/components/ModalProvider'

export default function MigrationPage() {
  const { confirm } = useAdminModal()
  const inputRef = useRef(null), [message, setMessage] = useState(''), [type, setType] = useState('success'), [busy, setBusy] = useState(false)
  const exportData = async () => { setBusy(true); try { const payload = await api('/admin/migration/export'); const blob = new Blob([JSON.stringify(payload.data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `komrez-backup-${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(url); setType('success'); setMessage('Backup downloaded successfully.') } catch (error) { setType('error'); setMessage(error.message) } finally { setBusy(false) } }
  const importData = async (file) => { if (!file || !await confirm({ title: 'Import MongoDB backup?', message: 'Existing records with matching IDs will be updated in the currently connected database.', confirmText: 'Import backup', tone: 'danger' })) return; setBusy(true); try { const backup = JSON.parse(await file.text()); const { data } = await api('/admin/migration/import', { method: 'POST', body: JSON.stringify(backup) }); setType('success'); setMessage(`Import complete: ${Object.values(data).reduce((a,b) => a+b, 0)} records processed.`) } catch (error) { setType('error'); setMessage(error.message) } finally { setBusy(false); inputRef.current.value = '' } }
  return <AdminShell title="Data migration" description="Move your complete Komrez data safely between MongoDB databases.">
    {message && <Notice type={type}>{message}</Notice>}
    <div className="mt-5 grid gap-5 lg:grid-cols-2"><section className="rounded-3xl border bg-white p-6"><DatabaseBackup size={30} /><h2 className="mt-4 text-xl font-black">1. Export backup</h2><p className="mt-2 text-sm leading-6 text-gray-500">Downloads products, categories, users, carts, orders, expenses, settings and notifications in one JSON backup.</p><button disabled={busy} onClick={exportData} className="mt-6 flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white disabled:opacity-50"><Download size={17} />Download backup</button></section>
      <section className="rounded-3xl border bg-white p-6"><Upload size={30} /><h2 className="mt-4 text-xl font-black">2. Import into new MongoDB</h2><p className="mt-2 text-sm leading-6 text-gray-500">Connect the backend to your new MongoDB URI, restart it, then upload the downloaded backup here.</p><button disabled={busy} onClick={() => inputRef.current?.click()} className="mt-6 flex items-center gap-2 rounded-xl border-2 border-black px-5 py-3 text-sm font-bold disabled:opacity-50"><Upload size={17} />Choose backup file</button><input ref={inputRef} hidden type="file" accept="application/json,.json" onChange={(e) => importData(e.target.files[0])} /></section></div>
    <div className="mt-5 flex gap-3 rounded-2xl bg-green-50 p-5 text-green-900"><ShieldCheck className="shrink-0" /><div><p className="font-bold">Safe migration flow</p><p className="mt-1 text-sm leading-6">Export first. Update <code>backend/.env</code> → <code>MONGODB_URI</code> with the new connection, restart backend, then import. Password hashes remain protected and record IDs stay unchanged.</p></div></div>
  </AdminShell>
}
