'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/lib/authStore'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { loginWithGoogle, loginWithEmail } = useAuthStore()
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleEmailAuth = async () => {
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await useAuthStore.getState().registerWithEmail(
          form.name,
          form.email,
          form.password
        )
      } else {
        await loginWithEmail(form.email, form.password)
      }
      router.push('/profile')
    } catch (err) {
      setError(err.message.includes('invalid') ? 'Invalid email or password' : err.message)
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      router.push('/profile')
    } catch (err) {
      setError('Google login failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <Link href="/" className="block text-center text-2xl font-bold uppercase tracking-widest mb-8 text-black">
          MYBRAND
        </Link>

        {/* Heading */}
        <h1 className="text-2xl font-bold uppercase tracking-widest text-center mb-2 text-black">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-gray-500 text-sm text-center mb-8">
          {isRegister ? 'Join MyBrand today!' : 'Login to your account'}
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white rounded-xl py-3 text-sm font-semibold text-black hover:bg-gray-50 hover:border-gray-400 transition mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">

          {/* Name — Only Register */}
          {isRegister && (
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1 block text-black">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1 block text-black">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1 block text-black">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleEmailAuth}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Please wait...
              </span>
            ) : (
              isRegister ? 'Create Account' : 'Login'
            )}
          </button>

        </div>

        {/* Toggle Register/Login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
              setForm({ name: '', email: '', password: '' })
            }}
            className="text-black font-bold hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>

      </div>
    </div>
  )
}