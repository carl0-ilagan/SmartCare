"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, Search, X } from "lucide-react"
import Image from "next/image"
import { AdminLogout } from "./admin-logout"

export function AdminTopNav({ onMenuToggle }) {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New doctor registration pending approval",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      message: "System backup completed successfully",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      message: "New feedback submitted by patient",
      time: "3 hours ago",
      read: true,
    },
  ])
  const [showNotifications, setShowNotifications] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-earth-beige bg-white px-4 lg:pl-64">
      <div className="flex items-center">
        <button
          onClick={onMenuToggle}
          className="mr-4 rounded-md p-2 text-drift-gray hover:bg-pale-stone hover:text-soft-amber lg:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </button>

        {showSearch ? (
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-earth-beige py-2 pl-10 pr-10 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber sm:w-64"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-drift-gray hover:text-soft-amber"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="rounded-md p-2 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="relative rounded-md p-2 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-md border border-earth-beige bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-earth-beige p-3">
                <h3 className="font-medium text-graphite">Notifications</h3>
                <button onClick={markAllAsRead} className="text-xs font-medium text-soft-amber hover:underline">
                  Mark all as read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-earth-beige">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-3 ${notification.read ? "" : "bg-pale-stone/50"}`}>
                        <p className="text-sm text-graphite">{notification.message}</p>
                        <p className="mt-1 text-xs text-drift-gray">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-drift-gray">No notifications</div>
                )}
              </div>
              <div className="border-t border-earth-beige p-3 text-center">
                <Link href="/admin/notifications" className="text-xs font-medium text-soft-amber hover:underline">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center space-x-2 rounded-md p-2 hover:bg-pale-stone"
          >
            <div className="h-8 w-8 overflow-hidden rounded-full bg-pale-stone">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Admin"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-graphite">Admin User</p>
              <p className="text-xs text-drift-gray">Administrator</p>
            </div>
          </button>
        </div>
      </div>

      <AdminLogout isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </header>
  )
}

// Also export as default for backward compatibility
export default AdminTopNav
