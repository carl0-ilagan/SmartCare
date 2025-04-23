"use client"
<<<<<<< HEAD
import { useState, useEffect } from "react"
=======

import { useState } from "react"
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
<<<<<<< HEAD
  UserCog,
  Calendar,
  FileText,
  Settings,
  Shield,
  ClipboardList,
  Bell,
  MessageSquare,
  ChevronRight,
  X,
} from "lucide-react"
import { AdminLogout } from "@/components/admin-logout"

export default function AdminSidebar({ isOpen = true, onClose, isMobile = false }) {
  const pathname = usePathname()

  // Handle escape key press to close sidebar on mobile
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobile && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isMobile, isOpen, onClose])

  // Prevent scrolling when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMobile, isOpen])

  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`
    : "fixed inset-y-0 left-0 w-64 bg-white shadow-md z-30"

  // Backdrop for mobile
  const backdrop = isMobile && isOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" onClick={onClose} />
  )

  return (
    <>
      {backdrop}
      <aside className={sidebarClasses}>
        {/* Logo and Close Button (Mobile) */}
        <div className="flex items-center justify-between p-4 border-b border-earth-beige">
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-soft-amber">Smart</span>
            <span className="text-xl font-bold text-graphite">Care</span>
            <span className="ml-2 text-xs bg-soft-amber text-white px-2 py-0.5 rounded">Admin</span>
          </Link>
          {isMobile && (
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5 text-graphite" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="space-y-1">
            <NavItem
              href="/admin/dashboard"
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Dashboard"
              active={pathname === "/admin/dashboard"}
            />

            {/* User Management Section */}
            <NavSection title="User Management">
              <NavItem
                href="/admin/patients"
                icon={<Users className="h-5 w-5" />}
                label="Patients"
                active={pathname === "/admin/patients"}
              />
              <NavItem
                href="/admin/doctors"
                icon={<UserCog className="h-5 w-5" />}
                label="Doctors"
                active={pathname === "/admin/doctors"}
              />
              <NavItem
                href="/admin/pending-accounts"
                icon={<Users className="h-5 w-5" />}
                label="Pending Accounts"
                active={pathname === "/admin/pending-accounts"}
                badge={23}
              />
            </NavSection>

            {/* Content Management */}
            <NavSection title="Management">
              <NavItem
                href="/admin/appointments"
                icon={<Calendar className="h-5 w-5" />}
                label="Appointments"
                active={pathname === "/admin/appointments"}
              />
              <NavItem
                href="/admin/reports"
                icon={<FileText className="h-5 w-5" />}
                label="Reports & Exports"
                active={pathname === "/admin/reports"}
              />
              <NavItem
                href="/admin/settings"
                icon={<Settings className="h-5 w-5" />}
                label="System Settings"
                active={pathname === "/admin/settings"}
              />
              <NavItem
                href="/admin/roles"
                icon={<Shield className="h-5 w-5" />}
                label="Roles & Permissions"
                active={pathname === "/admin/roles"}
              />
            </NavSection>

            {/* Monitoring */}
            <NavSection title="Monitoring">
              <NavItem
                href="/admin/logs"
                icon={<ClipboardList className="h-5 w-5" />}
                label="Audit Logs"
                active={pathname === "/admin/logs"}
              />
              <NavItem
                href="/admin/notifications"
                icon={<Bell className="h-5 w-5" />}
                label="Notifications"
                active={pathname === "/admin/notifications"}
              />
              <NavItem
                href="/admin/feedback"
                icon={<MessageSquare className="h-5 w-5" />}
                label="Feedback & Support"
                active={pathname === "/admin/feedback"}
                badge={5}
              />
            </NavSection>
          </div>

          {/* Add the logout option at the bottom */}
          <div className="mt-auto pt-4 border-t border-earth-beige">
            <AdminLogout />
          </div>
        </nav>
      </aside>
=======
  Calendar,
  FileText,
  Settings,
  ClipboardList,
  MessageSquare,
  Bell,
  UserCog,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Image from "next/image"
import { LogoutConfirmation } from "./logout-confirmation"

export function AdminSidebar({ isOpen }) {
  const pathname = usePathname()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({
    users: false,
    reports: false,
  })

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const isActive = (path) => {
    return pathname === path
  }

  const isActiveGroup = (paths) => {
    return paths.some((path) => pathname.startsWith(path))
  }

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-earth-beige px-4">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="SmartCare Logo" width={32} height={32} className="h-8 w-8" />
              <div>
                <span className="text-lg font-bold text-soft-amber">SmartCare</span>
                <span className="ml-1 text-xs font-medium text-drift-gray">Admin</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive("/admin/dashboard")
                      ? "bg-soft-amber/10 text-soft-amber"
                      : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
                  }`}
                >
                  <LayoutDashboard className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
              </li>

              {/* Users Group */}
              <li>
                <button
                  onClick={() => toggleMenu("users")}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${
                    isActiveGroup(["/admin/doctors", "/admin/patients", "/admin/pending-accounts"])
                      ? "bg-soft-amber/10 text-soft-amber"
                      : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
                  }`}
                >
                  <div className="flex items-center">
                    <Users className="mr-3 h-5 w-5" />
                    Users
                  </div>
                  {expandedMenus.users ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {expandedMenus.users && (
                  <ul className="mt-1 space-y-1 pl-10">
                    <li>
                      <Link
                        href="/admin/doctors"
                        className={`block rounded-md px-3 py-2 text-sm font-medium ${
                          isActive("/admin/doctors")
                            ? "bg-soft-amber/10 text-soft-amber"
                            : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
                        }`}
                      >
                        Doctors
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/patients"
                        className={`block rounded-md px-3 py-2 text-sm font-medium ${
                          isActive("/admin/patients")
                            ? "bg-soft-amber/10 text-soft-amber"
                            : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
                        }`}
                      >
                        Patients
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/pending-accounts"
                        className={`block rounded-md px-3 py-2 text-sm font-medium ${
                          isActive("/admin/pending-accounts")
                            ? "bg-soft-amber/10 text-soft-amber"
                            : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
                        }`}
                      >
                        Recent Registrations
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link
                  href="/admin/appointments"
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive("/admin/appointments")
                      ? "bg-soft-amber/10 text-soft-amber"
                      : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
                  }`}
                >
                  <Calendar className="mr-3 h-5 w-5" />
                  Appointments
                </Link>
              </li>

              {/* Reports Group */}
              <li>
                <button
                  onClick={() => toggleMenu("reports")}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${
                    isActiveGroup(["/admin/reports", "/admin/logs"])
                      ? "bg-soft-amber/10 text-soft-amber"
                      : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
                  }`}
                >
                  <div className="flex items-center">
                    <FileText className="mr-3 h-5 w-5" />
                    Reports
                  </div>
                  {expandedMenus.reports ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {expandedMenus.reports && (
                  <ul className="mt-1 space-y-1 pl-10">
                    <li>
                      <Link
                        href="/admin/reports"
                        className={`block rounded-md px-3 py-2 text-sm font-medium ${
                          isActive("/admin/reports")
                            ? "bg-soft-amber/10 text-soft-amber"
                            : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
                        }`}
                      >
                        Analytics
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/logs"
                        className={`block rounded-md px-3 py-2 text-sm font-medium ${
                          isActive("/admin/logs")
                            ? "bg-soft-amber/10 text-soft-amber"
                            : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
                        }`}
                      >
                        System Logs
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link
                  href="/admin/feedback"
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive("/admin/feedback")
                      ? "bg-soft-amber/10 text-soft-amber"
                      : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
                  }`}
                >
                  <MessageSquare className="mr-3 h-5 w-5" />
                  Feedback
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/notifications"
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive("/admin/notifications")
                      ? "bg-soft-amber/10 text-soft-amber"
                      : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
                  }`}
                >
                  <Bell className="mr-3 h-5 w-5" />
                  Notifications
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/roles"
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive("/admin/roles")
                      ? "bg-soft-amber/10 text-soft-amber"
                      : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
                  }`}
                >
                  <UserCog className="mr-3 h-5 w-5" />
                  Roles & Permissions
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/settings"
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive("/admin/settings")
                      ? "bg-soft-amber/10 text-soft-amber"
                      : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
                  }`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>

          {/* Profile & Logout */}
          <div className="border-t border-earth-beige p-4">
            <Link
              href="/admin/profile"
              className={`mb-2 flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                isActive("/admin/profile")
                  ? "bg-soft-amber/10 text-soft-amber"
                  : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
              }`}
            >
              <div className="mr-3 h-8 w-8 overflow-hidden rounded-full bg-pale-stone">
                <ClipboardList className="h-full w-full p-1.5 text-drift-gray" />
              </div>
              <div>
                <p className="font-medium text-graphite">Admin User</p>
                <p className="text-xs text-drift-gray">View Profile</p>
              </div>
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <LogoutConfirmation isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    </>
  )
}

<<<<<<< HEAD
// Navigation Item Component
function NavItem({ href, icon, label, active = false, badge }) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
        active ? "bg-soft-amber/10 text-soft-amber" : "text-drift-gray hover:bg-pale-stone hover:text-graphite"
      }`}
    >
      <div className="flex items-center">
        <span className={`mr-3 ${active ? "text-soft-amber" : ""}`}>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>}
    </Link>
  )
}

// Navigation Section Component
function NavSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-xs font-semibold text-drift-gray uppercase tracking-wider mb-2 hover:text-graphite"
      >
        <span>{title}</span>
        <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
      </button>
      <div className={`space-y-1 ml-1 ${isOpen ? "block" : "hidden"}`}>{children}</div>
    </div>
  )
}
=======
// Also export as default for backward compatibility
export default AdminSidebar
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
