"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AdminTopNav } from "@/components/admin-top-nav"
import AdminSidebar from "@/components/admin-sidebar"
import { AdminMobileNav } from "@/components/admin-mobile-nav"
import useMobile from "@/hooks/use-mobile"
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const isMobile = useMobile()
  const pathname = usePathname()

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Handle sidebar collapse
  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-pale-stone/30">
        {/* Desktop Sidebar */}
        {!isMobile && <AdminSidebar collapsed={sidebarCollapsed} onCollapse={handleSidebarCollapse} />}

        {/* Mobile Sidebar */}
        {isMobile && <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={true} />}

        {/* Main Content */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            !isMobile ? (sidebarCollapsed ? "ml-16" : "ml-56") : "ml-0"
          }`}
        >
          {/* Top Navigation */}
          <AdminTopNav onMenuClick={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />

          {/* Mobile Bottom Navigation */}
          {isMobile && <AdminMobileNav />}

          {/* Page Content */}
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
