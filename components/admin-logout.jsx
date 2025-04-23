"use client"

import { useState } from "react"
<<<<<<< HEAD
import { LogOut, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { LogoutConfirmation } from "@/components/logout-confirmation"

export function AdminLogout() {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    setShowLogoutConfirmation(true)
  }

  const confirmLogout = () => {
    // In a real application, this would call an API to invalidate the session
    // For now, we'll just redirect to the login page
    router.push("/login")
    setShowLogoutConfirmation(false)
  }

  const cancelLogout = () => {
    setShowLogoutConfirmation(false)
  }

  return (
    <>
      <button
        onClick={handleLogout}
        className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
      >
        <LogOut className="mr-2 h-5 w-5" />
        <span>Logout</span>
      </button>

      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        title="Logout from Admin Panel"
        message="Are you sure you want to logout from the admin panel? Any unsaved changes will be lost."
        icon={<AlertTriangle className="h-6 w-6 text-soft-amber" />}
      />
    </>
=======
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { signOutAdmin } from "@/lib/firebase"

export function AdminLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOutAdmin()
      router.push("/admin/login")
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-drift-gray transition-colors hover:bg-pale-stone hover:text-graphite"
    >
      <LogOut className="h-5 w-5" />
      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
    </button>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
  )
}
