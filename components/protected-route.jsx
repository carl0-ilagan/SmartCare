"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

// Add check for user status
export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, userRole, loading, userStatus } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      } else if (userStatus === 0) {
        // If user is pending approval, redirect to waiting page
        router.push("/waiting-approval")
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // If user doesn't have the required role, show access denied
        router.push("/access-denied")
      }
    }
  }, [user, userRole, loading, router, pathname, allowedRoles, userStatus])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-soft-amber"></div>
      </div>
    )
  }

  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) || userStatus === 0) {
    return null
  }

  return <>{children}</>
}
