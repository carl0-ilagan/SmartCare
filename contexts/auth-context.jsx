"use client"

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
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
