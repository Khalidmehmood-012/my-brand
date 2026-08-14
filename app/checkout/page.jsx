'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import useCartStore from '@/lib/store'
import useAuthStore, { getCustomerToken } from '@/lib/authStore'
import { API_URL, backendRequest } from '@/lib/backend'
import usePublicConfig from '@/lib/usePublicConfig'
import { pakistanLocations, shippingFor } from '@/data/pakistan-locations'
import { toast } from '@/components/ui/ToastProvider'

const blank = { name: '', email: '', password: '', phone: '', address: '', province: '', city: '', notes: '', addressLabel: 'Home' }
const labels = { name: 'Full name', email: 'Email address', password: 'Password', phone: 'Phone number', address: 'Delivery address', province: 'Province / region', city: 'City' }

export default function CheckoutPage() {
  const user = useAuthStore((state) => state.user), items = useCartStore((state) => state.items), clearCart = useCartStore((state) => state.clearCart)
  const { settings } = usePublicConfig()
  const methods = useMemo(() => (settings.payments?.methods || [{ id: 'cod', name: 'Cash on Delivery', type: 'cod', enabled: true, instructions: 'Pay when your order arrives.' }]).filter((method) => method.enabled), [settings.payments?.methods])
  const [form, setForm] = useState(blank), [addressMode, setAddressMode] = useState('new'), [payment, setPayment] = useState('cod')
  const [saveAccount, setSaveAccount] = useState(false)
  const [proof, setProof] = useState(''), [proofUploading, setProofUploading] = useState(false), [placing, setPlacing] = useState(false), [fieldErrors, setFieldErrors] = useState({}), [error, setError] = useState(''), [orderNumber, setOrderNumber] = useState('')
  const activePayment = methods.some((method) => method.id === payment) ? payment : (methods[0]?.id || 'cod')
  const selectedMethod = methods.find((method) => method.id === activePayment) || methods[0]
  const cities = form.province ? pakistanLocations[form.province] || [] : []
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = form.province ? shippingFor(form.province, subtotal, settings.store) : null
  const total = subtotal + (shipping || 0)
  useEffect(() => { if (error) toast('error', error, 'Checkout error') }, [error])

  useEffect(() => {
    if (!user) return
    const timeout = setTimeout(() => {
      const address = user.addresses?.find((item) => item.isDefault) || user.addresses?.[0]
      setForm((current) => ({ ...current, name: user.name || '', email: user.email || '', ...(address ? { phone: address.phone, address: address.address, province: address.province || 'Punjab', city: address.city, addressLabel: address.label } : {}) }))
      if (address) setAddressMode(String(address._id))
    }, 0)
    return () => clearTimeout(timeout)
  }, [user])

  const update = (name, value) => {
    setForm((current) => ({ ...current, [name]: value, ...(name === 'province' ? { city: '' } : {}) }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
  }
  const chooseAddress = (id) => {
    setFieldErrors({}); setError('')
    if (id === 'new') { setAddressMode('new'); setForm((current) => ({ ...blank, name: current.name, email: current.email })); return }
    const address = user.addresses.find((item) => String(item._id) === id)
    setAddressMode(id)
    setForm((current) => ({ ...current, name: address.name, phone: address.phone, address: address.address, province: address.province || 'Punjab', city: address.city, addressLabel: address.label }))
  }
  const validate = () => {
    const errors = {}
    if (form.name.trim().length < 2) errors.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.'
    if (!user && saveAccount && form.password.length < 8) errors.password = 'Password must contain at least 8 characters.'
    if (form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a valid Pakistan phone number with at least 10 digits.'
    if (!form.province) errors.province = 'Select your province or region.'
    if (!form.city || !cities.includes(form.city)) errors.city = 'Select a city from the selected province.'
    if (form.address.trim().length < 5) errors.address = 'Enter your complete street and house address.'
    if (selectedMethod?.type !== 'cod' && !proof) errors.paymentProof = 'Upload your payment screenshot.'
    setFieldErrors(errors)
    const firstError = Object.values(errors)[0]
    if (firstError) toast('warning', firstError, 'Complete checkout details')
    return Object.keys(errors).length === 0
  }
  const uploadProof = async (file) => {
    if (!file) return
    setProofUploading(true); setError(''); setFieldErrors((current) => ({ ...current, paymentProof: '' }))
    try { const body = new FormData(); body.append('image', file); const response = await fetch(`${API_URL}/uploads/payment-proof`, { method: 'POST', body }); const payload = await response.json(); if (!response.ok) throw new Error(payload.error?.message || 'Screenshot upload failed.'); setProof(payload.data.url); toast('success', 'Your payment screenshot has been uploaded.') } catch (uploadError) { setFieldErrors((current) => ({ ...current, paymentProof: uploadError.message })); toast('error', uploadError.message, 'Upload failed') } finally { setProofUploading(false) }
  }
  const placeOrder = async () => {
    if (placing || !validate()) return
    setPlacing(true); setError('')
    try {
      const { data: order } = await backendRequest('/orders', { method: 'POST', headers: getCustomerToken() ? { Authorization: `Bearer ${getCustomerToken()}` } : {}, body: JSON.stringify({ password: !user && saveAccount ? form.password : undefined, saveAddress: Boolean(user || saveAccount), addressLabel: form.addressLabel, customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), address: form.address.trim(), province: form.province, city: form.city }, notes: form.notes, paymentMethod: selectedMethod?.type || 'cod', paymentProof: proof, items: items.map((item) => ({ productId: item.id, name: item.name, slug: item.slug, image: item.image, price: item.price, quantity: item.quantity, selectedSize: item.selectedSize, isCustom: Boolean(item.isCustom), customDetails: item.customDetails })) }) })
      if (order.authToken) window.localStorage.setItem('komrez-customer-token', order.authToken)
      if (order.account) useAuthStore.setState({ user: order.account, loading: false })
      clearCart(); setOrderNumber(order.orderNumber)
    } catch (requestError) {
      const mapped = {}
      requestError.details?.forEach((detail) => { const key = (detail.field || detail.path?.join('.') || '').replace('customer.', ''); if (key) mapped[key] = detail.message })
      if (Object.keys(mapped).length) setFieldErrors(mapped)
      else setError(requestError.message)
    } finally { setPlacing(false) }
  }

  if (orderNumber) return <div className="flex min-h-screen items-center justify-center bg-white px-4 text-gray-950"><div className="max-w-md text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-3xl text-green-700">✓</div><h1 className="mt-5 text-4xl font-black">Order placed</h1><p className="mt-3 text-gray-600">Your order ID is <b className="text-black">{orderNumber}</b>. Keep it safe for tracking.</p><Link href={user ? '/profile' : '/track-order'} className="mt-6 inline-block rounded-xl bg-black px-7 py-3 text-sm font-bold text-white">{user ? 'View your order' : 'Track your order'}</Link></div></div>
  if (!items.length) return <div className="flex min-h-screen items-center justify-center bg-white text-gray-950"><div className="text-center"><h1 className="text-3xl font-black">Your cart is empty</h1><Link href="/shop" className="mt-5 inline-block rounded-xl bg-black px-6 py-3 text-white">Shop now</Link></div></div>

  return <main className="min-h-screen bg-[#f6f6f4] px-4 py-10 text-gray-950"><div className="mx-auto max-w-6xl"><p className="text-xs font-black uppercase tracking-[.2em] text-gray-500">Secure checkout</p><h1 className="mt-2 text-4xl font-black text-black">Complete your order</h1>{!user && <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-black text-black">Already have an account?</p><p className="mt-1 text-xs text-gray-500">Sign in to keep your cart, use saved addresses, and access order history.</p></div><Link href="/login?returnTo=/checkout" className="shrink-0 rounded-xl bg-black px-6 py-3 text-center text-xs font-black uppercase tracking-wide text-white">Login to continue</Link></div>}<div className="mt-8 grid gap-7 lg:grid-cols-[1fr_380px]"><div className="space-y-6">
    <Section number="1" title="Account & delivery">{user?.addresses?.length > 0 && <div className="mb-6"><p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-600">Choose delivery address</p><div className="grid gap-2 sm:grid-cols-2">{user.addresses.map((address) => <button type="button" key={address._id} onClick={() => chooseAddress(String(address._id))} className={`rounded-xl border-2 p-3 text-left text-sm transition ${addressMode === String(address._id) ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-500'}`}><b>{address.label}</b><span className={`mt-1 block text-xs ${addressMode === String(address._id) ? 'text-gray-300' : 'text-gray-600'}`}>{address.address}, {address.city}</span></button>)}<button type="button" onClick={() => chooseAddress('new')} className={`rounded-xl border-2 p-3 text-left text-sm font-bold transition ${addressMode === 'new' ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-500'}`}>+ Use a new address</button></div></div>}
      {user && addressMode !== 'new' ? <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-800"><b className="text-black">Using {form.addressLabel} address</b><p className="mt-2 leading-6">{form.name} · {form.phone}<br />{form.address}<br />{form.city}, {form.province}</p><p className="mt-3 text-xs text-gray-500">Select “Use a new address” above to enter different details.</p></div> : <div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" name="name" value={form.name} update={update} error={fieldErrors.name} required /><Field label="Email" name="email" type="email" value={form.email} update={update} error={fieldErrors.email} required disabled={Boolean(user)} />{!user && <label className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm font-bold text-gray-900"><input type="checkbox" checked={saveAccount} onChange={(e) => setSaveAccount(e.target.checked)} className="mt-0.5 h-4 w-4" /><span>Save my details and create an account <small className="mt-1 block font-medium text-gray-500">Optional — you can place the order without an account.</small></span></label>}{!user && saveAccount && <Field label="Create account password" name="password" type="password" value={form.password} update={update} error={fieldErrors.password} required hint="Minimum 8 characters." />}<Field label="Phone" name="phone" type="tel" value={form.phone} update={update} error={fieldErrors.phone} placeholder="03XXXXXXXXX" required /><Field label="Address label" name="addressLabel" value={form.addressLabel} update={update} /><Select label="Province / region" name="province" value={form.province} update={update} error={fieldErrors.province} options={Object.keys(pakistanLocations)} placeholder="Select province" /><Select label="City" name="city" value={form.city} update={update} error={fieldErrors.city} options={cities} placeholder={form.province ? 'Select city' : 'Select province first'} disabled={!form.province} /><label className="sm:col-span-2 text-xs font-black uppercase tracking-wide text-gray-700">Delivery address<textarea rows={3} value={form.address} onChange={(e) => update('address', e.target.value)} className={inputClass(fieldErrors.address)} placeholder="House, street, area" /></label></div>}<label className="mt-4 block text-xs font-black uppercase tracking-wide text-gray-700">Order notes <span className="font-medium text-gray-400">(optional)</span><textarea rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)} className={inputClass()} /></label>
    </Section>
    <Section number="2" title="Payment method"><div className="grid gap-3">{methods.map((method) => <button type="button" key={method.id} onClick={() => { setPayment(method.id); setProof(''); setFieldErrors((current) => ({ ...current, paymentProof: '' })) }} className={`rounded-2xl border-2 p-4 text-left transition ${activePayment === method.id ? 'border-black bg-gray-100 text-black' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-400'}`}><div className="flex items-center justify-between"><b>{method.name}</b><span className="text-xs font-bold uppercase text-gray-500">{method.type}</span></div><p className="mt-1 text-xs text-gray-600">{method.instructions}</p>{method.type !== 'cod' && activePayment === method.id && <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-800"><p><b>{method.bankName || method.name}</b></p><p className="mt-1">{method.accountTitle} · {method.accountNumber}</p></div>}</button>)}</div>{selectedMethod?.type !== 'cod' && <label className={`mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center text-gray-900 ${fieldErrors.paymentProof ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}><b>{proofUploading ? 'Uploading screenshot…' : proof ? 'Payment screenshot uploaded ✓' : 'Upload payment screenshot'}</b><span className="mt-1 text-xs text-gray-600">Admin will verify it before confirming your order.</span><input hidden type="file" accept="image/*" onChange={(e) => uploadProof(e.target.files[0])} /></label>}</Section>
  </div><aside className="h-fit rounded-3xl border border-gray-200 bg-white p-6 text-gray-950 shadow-sm lg:sticky lg:top-24"><h2 className="text-lg font-black text-black">Order summary</h2><div className="mt-4 space-y-3">{items.map((item) => <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3"><img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-gray-900">{item.name}</p><p className="text-xs text-gray-500">{item.selectedSize} · Qty {item.quantity}</p></div><b className="text-sm text-black">Rs. {(item.price * item.quantity).toLocaleString()}</b></div>)}</div><div className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm"><div className="flex justify-between text-gray-600"><span>Subtotal</span><b className="text-gray-900">Rs. {subtotal.toLocaleString()}</b></div><div className="flex justify-between text-gray-600"><span>Shipping</span><b className={shipping === 0 ? 'text-green-700' : 'text-gray-900'}>{shipping === null ? 'Select province' : shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}</b></div><div className="flex justify-between border-t border-gray-200 pt-3 text-black"><span className="font-black">Total</span><b className="text-xl">Rs. {total.toLocaleString()}</b></div></div>{shipping === 0 && <p className="mt-3 text-xs font-bold text-green-700">✓ You qualify for free shipping.</p>}<button disabled={placing || proofUploading} onClick={placeOrder} className="mt-5 w-full rounded-xl bg-black py-4 text-sm font-black uppercase text-white transition hover:bg-gray-800 disabled:opacity-50">{placing ? 'Placing order…' : 'Place order'}</button><p className="mt-3 text-center text-xs text-gray-500">Your account and address are saved securely for next time.</p></aside></div></div></main>
}

function inputClass(error) { return `mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium normal-case text-gray-950 outline-none placeholder:text-gray-400 focus:ring-2 ${error ? 'border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-black focus:ring-gray-100'}` }
function Section({ number, title, children }) { return <section className="rounded-3xl border border-gray-200 bg-white p-6 text-gray-950 shadow-sm"><div className="mb-5 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-black text-white">{number}</span><h2 className="font-black text-black">{title}</h2></div>{children}</section> }
function Field({ label, name, type = 'text', value, update, error, hint, ...props }) { return <label className="text-xs font-black uppercase tracking-wide text-gray-700">{label}<input type={type} value={value} onChange={(e) => update(name, e.target.value)} className={`${inputClass(error)} disabled:bg-gray-100 disabled:text-gray-600`} {...props} />{hint && <span className="mt-1.5 block text-[11px] font-medium normal-case text-gray-500">{hint}</span>}</label> }
function Select({ label, name, value, update, error, options, placeholder, ...props }) { return <label className="text-xs font-black uppercase tracking-wide text-gray-700">{label}<select value={value} onChange={(e) => update(name, e.target.value)} className={`${inputClass(error)} disabled:bg-gray-100 disabled:text-gray-500`} {...props}><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label> }
