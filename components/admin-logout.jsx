"use client"

import { useState } from "react"
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
  )
}
