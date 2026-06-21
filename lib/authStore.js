import { create } from 'zustand'
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  initAuth: () => {
    // Check redirect result first
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        const firebaseUser = result.user
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
          createdAt: new Date().toISOString(),
        }, { merge: true })

        set({
          user: {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photo: firebaseUser.photoURL,
          },
        })
      }
    })

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        set({
          user: {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photo: firebaseUser.photoURL,
            ...userDoc.data(),
          },
          loading: false,
        })
      } else {
        set({ user: null, loading: false })
      }
    })
  },

  // Google Login — Redirect use karo production ke liye
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider()
    await signInWithRedirect(auth, provider)
  },

  // Email Register
  registerWithEmail: async (name, email, password) => {
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
    await signOut(auth)
    set({ user: null })
  },
}))

export default useAuthStore