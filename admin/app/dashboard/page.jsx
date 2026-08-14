'use client'

import { useEffect, useState } from 'react'
import AdminShell, { Empty, Notice } from '@/components/AdminShell'
import { api } from '@/lib/api'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { api('/admin/dashboard').then((result) => setData(result.data)).catch((requestError) => setError(requestError.message)) }, [])

  const metrics = data ? [
    ['Monthly revenue', `Rs. ${data.metrics.monthlyRevenue.toLocaleString()}`],
    ['Product cost', `Rs. ${data.metrics.productCost.toLocaleString()}`],
    ['Operating expenses', `Rs. ${data.metrics.operatingExpenses.toLocaleString()}`],
    ['Gross profit', `Rs. ${data.metrics.grossProfit.toLocaleString()}`],
    ['Net profit', `Rs. ${data.metrics.netProfit.toLocaleString()}`],
    ['Stock purchase value', `Rs. ${data.metrics.stockPurchaseValue.toLocaleString()}`],
    ['Stock retail value', `Rs. ${data.metrics.stockRetailValue.toLocaleString()}`],
    ['Stock units held', data.metrics.stockUnits],
    ['Total orders', data.metrics.orders],
    ['Active products', data.metrics.products],
    ['Customers', data.metrics.customers],
    ['Needs attention', data.metrics.pendingOrders],
  ] : []

  return (
    <AdminShell title="Dashboard" description="A live overview of your Komrez store.">
      {error && <Notice>{error}</Notice>}
      {!data && !error && <div className="h-40 animate-pulse rounded-2xl bg-gray-200" />}
      {data && <>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([label, value]) => <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p><p className="mt-3 text-2xl font-black text-gray-950">{value}</p></div>)}
        </section>
        <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-5"><h2 className="text-sm font-black uppercase tracking-wider">Recent orders</h2>{data.recentOrders.length ? <div className="mt-4 divide-y divide-gray-100">{data.recentOrders.map((order) => <div key={order._id} className="flex items-center justify-between gap-4 py-3"><div><p className="text-sm font-bold">{order.orderNumber}</p><p className="text-xs text-gray-400">{order.customer.name}</p></div><div className="text-right"><p className="text-sm font-bold">Rs. {order.total.toLocaleString()}</p><p className="text-xs capitalize text-gray-400">{order.status}</p></div></div>)}</div> : <Empty>No orders yet.</Empty>}</div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5"><h2 className="text-sm font-black uppercase tracking-wider">Low stock</h2>{data.lowStock.length ? <div className="mt-4 space-y-2">{data.lowStock.map((product) => <div key={product._id} className="flex justify-between rounded-xl bg-red-50 px-4 py-3"><span className="truncate text-sm font-bold">{product.name}</span><span className="text-sm text-red-600">{product.stock}</span></div>)}</div> : <div className="mt-4 rounded-xl bg-green-50 px-4 py-4 text-sm text-green-700">All products have healthy stock.</div>}</div>
        </section>
      </>}
    </AdminShell>
  )
}
