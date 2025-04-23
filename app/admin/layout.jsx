"use client"
<<<<<<< HEAD
import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import AdminTopNav from "@/components/admin-top-nav"
import AdminMobileNav from "@/components/admin-mobile-nav"
import { usePathname } from "next/navigation"
import useMobile from "@/hooks/use-mobile"

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  return (
    <div className="min-h-screen bg-pale-stone flex flex-col">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar - shows when toggled */}
      {isMobile && <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={true} />}

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen flex flex-col flex-grow">
        <AdminTopNav onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 pt-20 md:pt-24 pb-20 md:pb-6 w-full">{children}</main>

        {/* Mobile Bottom Navigation */}
        {isMobile && <AdminMobileNav />}
      </div>
=======

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminTopNav } from "@/components/admin-top-nav"
import { AdminMobileNav } from "@/components/admin-mobile-nav"
import { getAdminAuthStatus } from "@/lib/firebase"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated as admin
    const adminAuth = getAdminAuthStatus()

    // If not on login page and not authenticated, redirect to admin login
    if (!pathname.includes("/admin/login")) {
      if (!adminAuth) {
        router.push("/admin/login")
      } else {
        setIsAuthenticated(true)
      }
    } else {
      // On login page but already authenticated, redirect to dashboard
      if (adminAuth) {
        router.push("/admin/dashboard")
      }
    }

    setIsLoading(false)
  }, [pathname, router])

  // Show loading state
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  // If on login page or not authenticated yet, just render children
  if (pathname.includes("/admin/login") || !isAuthenticated) {
    return <>{children}</>
  }

  // Admin dashboard layout
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopNav />
        <main className="flex-1 overflow-y-auto bg-pale-stone p-4 md:p-6">{children}</main>
      </div>
      <AdminMobileNav />
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    </div>
  )
}
