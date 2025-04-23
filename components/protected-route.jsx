"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { isUserAdmin } from "@/lib/admin-utils"

export function ProtectedRoute({ children, requiredRole = null }) {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)

      if (!user) {
        router.push("/login")
        return
      }

      // Check if this is an admin route
      if (pathname.startsWith("/admin")) {
        const adminStatus = await isUserAdmin(user.uid)
        if (!adminStatus) {
          setAccessDenied(true)
          return
        }
      }

      // For non-admin routes, check role as before
      else if (requiredRole && userRole !== requiredRole) {
        setAccessDenied(true)
        return
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [user, userRole, pathname, router, requiredRole])

  // Show loading or nothing while checking authentication
  if (isLoading || accessDenied) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-soft-amber"></div>
      </div>
    )
  }

  return children
}
