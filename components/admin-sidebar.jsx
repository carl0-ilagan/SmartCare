"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
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
    </>
  )
}

// Also export as default for backward compatibility
export default AdminSidebar
