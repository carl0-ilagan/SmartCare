"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Menu } from "lucide-react"
import { NotificationDropdown } from "./notification-dropdown"

export function AdminTopNav({ onMenuToggle }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Implement mobile detection directly in the component
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-earth-beige bg-white px-4 md:px-6">
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={onMenuToggle}
            className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </button>
        )}
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Smart Care Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-graphite">Smart Care</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></span>
            <span className="sr-only">Notifications</span>
          </button>
          <NotificationDropdown isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        </div>
        <Link href="/admin/profile" className="flex items-center gap-2 rounded-full">
          <img
            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Admin profile"
            className="h-8 w-8 rounded-full object-cover"
          />
        </Link>
      </div>
    </header>
  )
}
