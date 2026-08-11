import { create } from 'zustand'
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from './firebase'

const requireFirebase = () => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add the required values to .env.local.')
  }
}

const mapFirebaseUser = (firebaseUser, profile = {}) => ({
  uid: firebaseUser.uid,
  name: firebaseUser.displayName,
  email: firebaseUser.email,
  photo: firebaseUser.photoURL,
  ...profile,
})

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

 initAuth: () => {
  if (!isFirebaseConfigured) {
    set({ user: null, loading: false })
    return () => {}
  }
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Authentication must not depend on Firestore being enabled or readable.
      set({ user: mapFirebaseUser(firebaseUser), loading: false })

      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          set({ user: mapFirebaseUser(firebaseUser, userDoc.data()) })
        }
      } catch {
        // Keep the authenticated Firebase user when an optional profile read fails.
      }
    } else {
      set({ user: null, loading: false })
    }
  })
  return unsubscribe
},

  // Popup returns the authenticated user immediately, so the UI can continue.
  loginWithGoogle: async () => {
    requireFirebase()
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const firebaseUser = result.user

    set({ user: mapFirebaseUser(firebaseUser), loading: false })

    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photo: firebaseUser.photoURL,
        lastLoginAt: new Date().toISOString(),
      }, { merge: true })
    } catch {
      // Login remains successful even if the optional profile write is blocked.
    }

    return firebaseUser
  },

  // Email Register
  registerWithEmail: async (name, email, password) => {
    requireFirebase()
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = result.user

    await updateProfile(firebaseUser, { displayName: name })

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      name,
      email,
      photo: null,
      createdAt: new Date().toISOString(),
    })

    set({
      user: {
        uid: firebaseUser.uid,
        name,
        email,
        photo: null,
      },
    })
  },

  // Email Login
  loginWithEmail: async (email, password) => {
    requireFirebase()
    const result = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = result.user

    set({
      user: {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photo: firebaseUser.photoURL,
      },
    })
  },

  // Logout
  logout: async () => {
    requireFirebase()
    await signOut(auth)
    set({ user: null })
  },
}))

export default useAuthStore
