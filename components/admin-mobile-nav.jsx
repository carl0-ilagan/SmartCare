"use client"
<<<<<<< HEAD
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Calendar, Settings, ClipboardList } from "lucide-react"
import { AdminLogout } from "@/components/admin-logout"

export default function AdminMobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Users",
      href: "/admin/patients",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Appointments",
      href: "/admin/appointments",
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: "Logs",
      href: "/admin/logs",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/admin/settings",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-earth-beige z-20 md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-2 px-3 ${
              pathname === item.href ? "text-soft-amber" : "text-drift-gray"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
        {/* Add the logout option at the bottom */}
        <div className="mt-4 pt-4 border-t border-earth-beige">
          <AdminLogout />
        </div>
      </div>
    </nav>
=======

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Calendar,
  Home,
  Menu,
  Settings,
  User,
  Users,
  X,
  ClipboardList,
  Shield,
  Clock,
  MessageCircle,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function AdminMobileNav() {
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
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/patients", label: "Patients", icon: Users },
    { href: "/admin/doctors", label: "Doctors", icon: User },
    { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  ]

  const moreLinks = [
    { href: "/admin/pending-accounts", label: "Pending", icon: Clock },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/feedback", label: "Feedback", icon: MessageCircle },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/roles", label: "Roles", icon: Shield },
    { href: "/admin/logs", label: "Logs", icon: ClipboardList },
    { href: "/admin/profile", label: "Profile", icon: User },
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
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
  )
}
