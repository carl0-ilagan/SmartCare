"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  FileText,
  Home,
  Menu,
  MessageSquare,
  Settings,
  User,
  X,
  FileArchive,
  MessageCircle,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function MobileNav() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  // Close menu when navigating
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Don't render on desktop
  if (!isMobile) return null

  const navLinks = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
    { href: "/dashboard/prescriptions", label: "Prescriptions", icon: FileText },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  ]

  const moreLinks = [
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/records", label: "Records", icon: FileArchive },
    { href: "/dashboard/feedback", label: "Feedback", icon: MessageCircle },
  ]

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-pale-stone bg-white md:hidden">
        <div className="flex h-16 items-center justify-around">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-1 flex-col items-center justify-center py-2 ${
                isActive(link.href) ? "text-soft-amber" : "text-drift-gray hover:text-soft-amber"
              }`}
            >
              <link.icon className="h-5 w-5" />
              <span className="mt-1 text-xs">{link.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-1 flex-col items-center justify-center py-2 text-drift-gray hover:text-soft-amber"
          >
            <Menu className="h-5 w-5" />
            <span className="mt-1 text-xs">More</span>
          </button>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}></div>}

      <div
        className={`fixed bottom-16 left-0 right-0 z-50 transform bg-white p-4 shadow-lg transition-transform duration-300 md:hidden ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between">
          <h3 className="text-lg font-medium text-graphite">More Options</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {moreLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center rounded-md p-3 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
              onClick={() => setIsOpen(false)}
            >
              <link.icon className="h-6 w-6" />
              <span className="mt-1 text-xs">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
