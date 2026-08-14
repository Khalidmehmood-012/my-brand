import { create } from 'zustand'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth, isFirebaseConfigured } from './firebase'
import { backendRequest } from './backend'

const TOKEN_KEY = 'komrez-customer-token'
export const getCustomerToken = () => typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_KEY)

async function establishSession(payload, set) {
  window.localStorage.setItem(TOKEN_KEY, payload.token)
  set({ user: payload.user, loading: false })
  const { default: useCartStore } = await import('./store')
  await useCartStore.getState().syncAfterLogin()
  return payload.user
}

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  initAuth: async () => {
    const token = getCustomerToken()
    if (!token) { set({ user: null, loading: false }); return }
    try {
      const { data } = await backendRequest('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      set({ user: data, loading: false })
      const { default: useCartStore } = await import('./store')
      await useCartStore.getState().loadServerCart()
    } catch {
      window.localStorage.removeItem(TOKEN_KEY)
      set({ user: null, loading: false })
    }
  },
  registerWithEmail: async (name, email, password) => {
    const { data } = await backendRequest('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
    return establishSession(data, set)
  },
  loginWithEmail: async (email, password) => {
    const { data } = await backendRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    return establishSession(data, set)
  },
  loginWithGoogle: async () => {
    if (!isFirebaseConfigured) throw new Error('Google login is not configured.')
    const result = await signInWithPopup(auth, new GoogleAuthProvider())
    const idToken = await result.user.getIdToken()
    const { data } = await backendRequest('/auth/firebase', { method: 'POST', body: JSON.stringify({ idToken }) })
    return establishSession(data, set)
  },
  logout: async () => {
    window.localStorage.removeItem(TOKEN_KEY)
    if (isFirebaseConfigured) await signOut(auth).catch(() => {})
    set({ user: null, loading: false })
  },
}))

export default useAuthStore
