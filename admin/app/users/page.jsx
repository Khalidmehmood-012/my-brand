'use client'

import { useCallback, useEffect, useState } from 'react'
import AdminShell, { Empty, Notice } from '@/components/AdminShell'
import { api } from '@/lib/api'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const load = useCallback(() => api('/admin/users?limit=100').then(({ data }) => setUsers(data)).catch((requestError) => setError(requestError.message)), [])
  useEffect(() => { load() }, [load])
  const update = async (id, patch) => { try { await api(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }); await load() } catch (requestError) { setError(requestError.message) } }

  return <AdminShell title="Users" description="Manage customers, staff and account access.">{error && <Notice>{error}</Notice>}<div className="mt-4 overflow-x-auto rounded-2xl border border-gray-200 bg-white"><table className="w-full min-w-200 text-left"><thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400"><tr><th className="p-4">User</th><th>Role</th><th>Orders</th><th>Spent</th><th className="p-4">Access</th></tr></thead><tbody className="divide-y divide-gray-100">{users.map((user) => <tr key={user._id}><td className="p-4"><p className="text-sm font-bold">{user.name}</p><p className="text-xs text-gray-400">{user.email}</p></td><td><select value={user.role} onChange={(event) => update(user._id, { role: event.target.value })} className="rounded-lg border px-2 py-2 text-xs"><option>customer</option><option>staff</option><option>admin</option></select></td><td className="text-sm">{user.totalOrders}</td><td className="text-sm font-bold">Rs. {user.totalSpent.toLocaleString()}</td><td className="p-4"><button onClick={() => update(user._id, { isActive: !user.isActive })} className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${user.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{user.isActive ? 'Active' : 'Disabled'}</button></td></tr>)}</tbody></table>{!users.length && <Empty>No users found.</Empty>}</div></AdminShell>
}
