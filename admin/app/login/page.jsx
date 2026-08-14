'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, setSession } from '@/lib/api'
import { toast } from '@/components/ToastProvider'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: 'admin@komrez.com', password: 'ChangeMe123!' })
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const { data } = await api('/auth/login', { method: 'POST', body: JSON.stringify(form) })
      if (!['admin', 'staff'].includes(data.user.role)) throw new Error('Admin access is required.')
      setSession(data.token, data.user)
      router.replace('/dashboard')
    } catch (requestError) {
      toast('error', requestError.message, 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="hidden bg-gray-950 p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <p className="text-2xl font-black uppercase tracking-[0.2em]">Komrez<span className="text-gray-600">.</span></p>
        <div><p className="text-xs font-black uppercase tracking-[0.25em] text-gray-500">Store control center</p><h1 className="mt-4 text-6xl font-black leading-none">Manage the<br />whole store.</h1></div>
        <p className="text-sm text-gray-500">Products, inventory, orders and customers in one place.</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-md">
          <p className="mb-8 text-2xl font-black uppercase tracking-[0.2em] lg:hidden">Komrez.</p>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Admin portal</p>
          <h2 className="mt-2 text-4xl font-black text-gray-950">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500">Sign in with the admin account created by the seed command.</p>
          <label className="mt-7 block text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
          <input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black" />
          <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
          <input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black" />
          <button disabled={loading} className="mt-7 w-full rounded-xl bg-black py-3.5 text-sm font-black uppercase tracking-wider text-white disabled:opacity-50">{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </section>
    </main>
  )
}
