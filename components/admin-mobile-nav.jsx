"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Calendar, MessageSquare, LogOut } from "lucide-react"
import { LogoutConfirmation } from "./logout-confirmation"

export function AdminMobileNav({ isOpen, onClose }) {
  const pathname = usePathname()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const isActive = (path) => {
    return pathname === path
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      ></div>

      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-earth-beige bg-white py-2 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } lg:hidden`}
      >
        <Link
          href="/admin/dashboard"
          className={`flex flex-col items-center rounded-md p-2 ${
            isActive("/admin/dashboard") ? "text-soft-amber" : "text-drift-gray hover:text-soft-amber"
          }`}
          onClick={onClose}
        >
          <LayoutDashboard className="h-6 w-6" />
          <span className="mt-1 text-xs">Dashboard</span>
        </Link>

        <Link
          href="/admin/doctors"
          className={`flex flex-col items-center rounded-md p-2 ${
            isActive("/admin/doctors") ? "text-soft-amber" : "text-drift-gray hover:text-soft-amber"
          }`}
          onClick={onClose}
        >
          <Users className="h-6 w-6" />
          <span className="mt-1 text-xs">Doctors</span>
        </Link>

        <Link
          href="/admin/patients"
          className={`flex flex-col items-center rounded-md p-2 ${
            isActive("/admin/patients") ? "text-soft-amber" : "text-drift-gray hover:text-soft-amber"
          }`}
          onClick={onClose}
        >
          <Users className="h-6 w-6" />
          <span className="mt-1 text-xs">Patients</span>
        </Link>

        <Link
          href="/admin/appointments"
          className={`flex flex-col items-center rounded-md p-2 ${
            isActive("/admin/appointments") ? "text-soft-amber" : "text-drift-gray hover:text-soft-amber"
          }`}
          onClick={onClose}
        >
          <Calendar className="h-6 w-6" />
          <span className="mt-1 text-xs">Appointments</span>
        </Link>

        <Link
          href="/admin/feedback"
          className={`flex flex-col items-center rounded-md p-2 ${
            isActive("/admin/feedback") ? "text-soft-amber" : "text-drift-gray hover:text-soft-amber"
          }`}
          onClick={onClose}
        >
          <MessageSquare className="h-6 w-6" />
          <span className="mt-1 text-xs">Feedback</span>
        </Link>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex flex-col items-center rounded-md p-2 text-red-500 hover:text-red-600"
        >
          <LogOut className="h-6 w-6" />
          <span className="mt-1 text-xs">Sign Out</span>
        </button>
      </nav>

      <LogoutConfirmation isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </>
  )
}

// Also export as default for backward compatibility
export default AdminMobileNav
