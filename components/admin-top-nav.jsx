"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Bell, Search, Menu, User, Settings, LogOut, Edit } from "lucide-react"
import useMobile from "@/hooks/use-mobile"
import { useAuth } from "@/contexts/auth-context"
import { LogoutConfirmation } from "@/components/logout-confirmation"
import ProfileImage from "./profile-image"
import { Logo } from "@/components/logo"

export function AdminTopNav({ onMenuClick, sidebarCollapsed }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const searchInputRef = useRef(null)
  const searchButtonRef = useRef(null)
  const isMobile = useMobile()
  const { user, userProfile, logout } = useAuth()

  // Mock notifications
  const notifications = [
    { id: 1, message: "New doctor registration pending approval", time: "10 minutes ago", unread: true },
    { id: 2, message: "System backup completed successfully", time: "2 hours ago", unread: true },
    { id: 3, message: "5 new patient registrations today", time: "5 hours ago", unread: false },
  ]

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    // Close other menus
    setShowUserMenu(false)
  }

  // Toggle user menu dropdown
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
    // Close other menus
    setShowNotifications(false)
  }

  // Handle logout
  const handleLogout = () => {
    setShowLogoutModal(true)
    setShowUserMenu(false)
  }

  // Confirm logout
  const confirmLogout = () => {
    logout()
    setShowLogoutModal(false)
  }

  // Close dropdowns when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest(".dropdown-container") && !e.target.closest(".search-container")) {
      setShowNotifications(false)
      setShowUserMenu(false)
    }
  }

  // Add click outside listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Get profile photo URL from userProfile or user
  const profilePhotoURL = userProfile?.photoURL || user?.photoURL || null

  return (
    <header
      className={`
  sticky top-0 z-20 bg-white shadow-sm w-full
  transition-all duration-300 ease-in-out mb-0
`}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left side - Menu button (mobile) and Logo - SmartCare - Role */}
        <div className="flex items-center">
          {isMobile && (
            <button onClick={onMenuClick} className="p-2 mr-2 rounded-full hover:bg-pale-stone">
              <Menu className="h-5 w-5 text-graphite" />
            </button>
          )}

          {/* Logo with smooth transition - only show when sidebar is collapsed or on mobile */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              sidebarCollapsed || isMobile ? "w-auto opacity-100 max-w-[200px]" : "w-0 opacity-0 max-w-0"
            }`}
          >
            <Logo href="/admin/dashboard" showBadge={true} badgeText="Admin" />
          </div>
        </div>

        {/* Right side - Search, notifications, user menu */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Search button and animated search bar */}
          <div className="search-container relative">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className="w-40 md:w-64 px-4 py-1.5 pl-9 bg-pale-stone rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-soft-amber"
              />
              <Search className="h-4 w-4 text-drift-gray absolute left-3 top-2" />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative dropdown-container">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-full hover:bg-pale-stone text-drift-gray relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-30 border border-earth-beige">
                <div className="px-4 py-2 border-b border-earth-beige flex justify-between items-center">
                  <h3 className="font-semibold text-graphite">Notifications</h3>
                  <Link href="/admin/notifications" className="text-xs text-soft-amber hover:underline">
                    View All
                  </Link>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-earth-beige last:border-0 hover:bg-pale-stone ${
                        notification.unread ? "bg-pale-stone/50" : ""
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <p className="text-sm text-graphite">{notification.message}</p>
                          <p className="text-xs text-drift-gray mt-1">{notification.time}</p>
                        </div>
                        {notification.unread && <span className="h-2 w-2 bg-soft-amber rounded-full mt-1"></span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative dropdown-container">
            <button onClick={toggleUserMenu} className="flex items-center p-1 rounded-full hover:bg-pale-stone">
              <ProfileImage src={profilePhotoURL} alt="Admin" className="h-8 w-8" role="admin" />
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-30 border border-earth-beige">
                <div className="px-4 py-2 border-b border-earth-beige">
                  <p className="font-medium text-sm text-graphite">
                    {userProfile?.displayName || user?.displayName || "Admin User"}
                  </p>
                  <p className="text-xs text-drift-gray">
                    {userProfile?.email || user?.email || "admin@smartcare.com"}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/admin/profile"
                    className="flex items-center px-4 py-2 text-sm text-drift-gray hover:bg-pale-stone"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-drift-gray hover:bg-pale-stone"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </Link>
                  <Link
                    href="/admin/welcome-editor"
                    className="flex items-center px-4 py-2 text-sm text-drift-gray hover:bg-pale-stone"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    <span>Welcome Page</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-drift-gray hover:bg-pale-stone w-full text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </header>
  )
}
