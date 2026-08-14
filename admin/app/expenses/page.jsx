'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import AdminShell, { Empty, Notice } from '@/components/AdminShell'
import { api } from '@/lib/api'
import { useAdminModal } from '@/components/ModalProvider'
import { toast } from '@/components/ToastProvider'

const categories = ['marketing', 'shipping', 'operations', 'salary', 'rent', 'utilities', 'other']
const initial = { title: '', category: 'operations', amount: '', expenseDate: new Date().toISOString().slice(0, 10), note: '' }

export default function ExpensesPage() {
  const { confirm } = useAdminModal()
  const [expenses, setExpenses] = useState([]), [form, setForm] = useState(initial), [error, setError] = useState('')
  const load = useCallback(() => api('/admin/expenses').then(({ data }) => setExpenses(data)).catch((requestError) => setError(requestError.message)), [])
  useEffect(() => { load() }, [load])
  const add = async (event) => { event.preventDefault(); setError(''); try { await api('/admin/expenses', { method: 'POST', body: JSON.stringify({ ...form, amount: Number(form.amount) }) }); toast('success', 'Expense has been saved.'); setForm(initial); await load() } catch (requestError) { setError(requestError.message) } }
  const remove = async (id) => { if (!await confirm({ title: 'Delete expense?', message: 'This expense will be removed from profit and expense reporting.', confirmText: 'Delete', tone: 'danger' })) return; await api(`/admin/expenses/${id}`, { method: 'DELETE' }); await load() }
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  return <AdminShell title="Expenses" description="Record operating costs for accurate net profit.">{error && <Notice>{error}</Notice>}<div className="mt-4 grid gap-6 xl:grid-cols-[380px_1fr]"><form onSubmit={add} className="h-fit rounded-2xl border bg-white p-5"><h2 className="font-black">Add expense</h2><label className="mt-4 block text-xs font-bold uppercase text-gray-500">Title<input required minLength={2} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" /></label><label className="mt-3 block text-xs font-bold uppercase text-gray-500">Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label className="mt-3 block text-xs font-bold uppercase text-gray-500">Amount<input required min="0" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input" /></label><label className="mt-3 block text-xs font-bold uppercase text-gray-500">Date<input required type="date" value={form.expenseDate} onChange={(e) => setForm({ ...form, expenseDate: e.target.value })} className="input" /></label><label className="mt-3 block text-xs font-bold uppercase text-gray-500">Note<textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input" /></label><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-bold text-white"><Plus size={16} />Save expense</button></form><section className="overflow-hidden rounded-2xl border bg-white"><div className="flex items-center justify-between border-b p-5"><h2 className="font-black">Expense history</h2><p className="text-sm font-black">Rs. {total.toLocaleString()}</p></div>{expenses.length ? <div className="divide-y">{expenses.map((expense) => <div key={expense._id} className="flex items-center justify-between gap-4 p-4"><div><p className="text-sm font-bold">{expense.title}</p><p className="text-xs capitalize text-gray-400">{expense.category} · {new Date(expense.expenseDate).toLocaleDateString()}</p></div><div className="flex items-center gap-3"><b className="text-sm">Rs. {expense.amount.toLocaleString()}</b><button aria-label={`Delete ${expense.title}`} onClick={() => remove(expense._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button></div></div>)}</div> : <Empty>No expenses recorded.</Empty>}</section></div></AdminShell>
}
