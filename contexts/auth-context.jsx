"use client"

<<<<<<< HEAD
import { createContext, useContext, useEffect, useState } from "react"
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { updateLastLogin } from "@/lib/firebase-utils"

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)

        // Get user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role)
            // Update last login timestamp
            updateLastLogin(user.uid)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        setUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Sign up with email and password
  const signup = async (email, password, name, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile with name
      await updateProfile(user, {
        displayName: name,
      })

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: role,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      })

      setUserRole(role)
      return user
    } catch (error) {
      throw error
    }
  }

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role)
        // Update last login timestamp
        updateLastLogin(user.uid)
      }

      return user
    } catch (error) {
      console.error("Login error:", error.code, error.message)
      throw error
    }
  }

  // Sign in with Google
  const signInWithGoogle = async (defaultRole = "patient") => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))

      if (!userDoc.exists()) {
        // New user - create record with default role
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: defaultRole,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        })
        setUserRole(defaultRole)
      } else {
        // Existing user - get role
        setUserRole(userDoc.data().role)
        // Update last login timestamp
        updateLastLogin(user.uid)
      }

      return user
    } catch (error) {
      // Handle popup closed error gracefully
      if (error.code === "auth/popup-closed-by-user") {
        console.log("Sign-in popup was closed before completing the sign-in process")
        // Don't throw an error for this specific case
        return null
      }
      throw error
    }
  }

  // Logout
  const logout = async () => {
    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    userRole,
    loading,
    signup,
    login,
    signInWithGoogle,
    logout,
=======
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { auth, getUserData } from "@/lib/firebase"

const AuthContext = createContext({
  user: null,
  userData: null,
  loading: true,
  error: null,
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      try {
        if (authUser) {
          setUser(authUser)

          // Fetch additional user data from Firestore
          const userDoc = await getUserData(authUser.uid)
          setUserData(userDoc)

          // Handle redirects based on user type and current path
          const isPublicPage =
            pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname.startsWith("/information")

          const isPatientPage = pathname.startsWith("/dashboard")
          const isDoctorPage = pathname.startsWith("/doctor")
          const isAdminPage = pathname.startsWith("/admin")

          if (isPublicPage) {
            // Redirect logged-in users to their dashboard
            if (userDoc.userType === "patient") {
              router.push("/dashboard")
            } else if (userDoc.userType === "doctor") {
              router.push("/doctor/dashboard")
            } else if (userDoc.userType === "admin") {
              router.push("/admin/dashboard")
            }
          } else if (isPatientPage && userDoc.userType !== "patient") {
            // Redirect non-patients away from patient pages
            if (userDoc.userType === "doctor") {
              router.push("/doctor/dashboard")
            } else if (userDoc.userType === "admin") {
              router.push("/admin/dashboard")
            } else {
              router.push("/")
            }
          } else if (isDoctorPage && userDoc.userType !== "doctor") {
            // Redirect non-doctors away from doctor pages
            if (userDoc.userType === "patient") {
              router.push("/dashboard")
            } else if (userDoc.userType === "admin") {
              router.push("/admin/dashboard")
            } else {
              router.push("/")
            }
          } else if (isAdminPage && userDoc.userType !== "admin") {
            // Redirect non-admins away from admin pages
            if (userDoc.userType === "patient") {
              router.push("/dashboard")
            } else if (userDoc.userType === "doctor") {
              router.push("/doctor/dashboard")
            } else {
              router.push("/")
            }
          }
        } else {
          setUser(null)
          setUserData(null)

          // Redirect unauthenticated users away from protected pages
          const isProtectedPage =
            pathname.startsWith("/dashboard") || pathname.startsWith("/doctor") || pathname.startsWith("/admin")

          if (isProtectedPage) {
            router.push("/login")
          }
        }
      } catch (err) {
        console.error("Error in auth state change:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [pathname, router])

  const value = {
    user,
    userData,
    loading,
    error,
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
<<<<<<< HEAD
=======

export const useAuth = () => useContext(AuthContext)
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
