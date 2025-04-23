"use client"

<<<<<<< HEAD
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { WelcomeSidebar } from "./welcome-sidebar"

export function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
=======
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, User } from "lucide-react"
import { WelcomeSidebar } from "./welcome-sidebar"
import { auth } from "@/lib/firebase"
import { useMobile } from "@/hooks/use-mobile"

export function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState(null)
  const isMobile = useMobile()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Get user data from Firestore to determine user type
          const userDoc = await fetch(`/api/users/${user.uid}`).then((res) => res.json())
          const type = userDoc.userType || null
          setUserType(type)

          // Check if we're on the welcome/home page and redirect if needed
          const isWelcomePage = window.location.pathname === "/" || window.location.pathname === "/information"

          if (isWelcomePage) {
            // Redirect based on user type
            if (type === "patient") {
              window.location.href = "/dashboard"
              return
            } else if (type === "doctor") {
              window.location.href = "/doctor/dashboard"
              return
            } else if (type === "admin") {
              window.location.href = "/admin/dashboard"
              return
            }
          }
        } catch (error) {
          console.error("Error fetching user type:", error)
        }
      }
      setCurrentUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleUserClick = () => {
    if (!currentUser) return

    // Redirect based on user type
    if (userType === "patient") {
      window.location.href = "/dashboard"
    } else if (userType === "doctor") {
      window.location.href = "/doctor/dashboard"
    }
  }
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

  return (
    <header className="sticky top-0 z-40 w-full border-b border-earth-beige/40 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="SmartCare Logo" width={36} height={36} className="h-9 w-9" />
          <span className="text-xl font-bold text-soft-amber">SmartCare</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:space-x-6">
          <Link href="/" className="text-sm font-medium text-graphite transition-colors hover:text-soft-amber">
            Home
          </Link>
          <Link
            href="/information?section=about"
            className="text-sm font-medium text-graphite transition-colors hover:text-soft-amber"
          >
            About
          </Link>
          <Link
            href="/information?section=services"
            className="text-sm font-medium text-graphite transition-colors hover:text-soft-amber"
          >
            Services
          </Link>
          <Link
            href="/information?section=doctors"
            className="text-sm font-medium text-graphite transition-colors hover:text-soft-amber"
          >
            Doctors
          </Link>
          <Link
            href="/information?section=contact"
            className="text-sm font-medium text-graphite transition-colors hover:text-soft-amber"
          >
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex md:items-center md:space-x-4">
<<<<<<< HEAD
          <Link
            href="/login"
            className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
          >
            Sign Up
          </Link>
=======
          {!loading && currentUser ? (
            <div
              className="flex items-center space-x-3 cursor-pointer hover:bg-pale-stone rounded-md p-2 transition-colors"
              onClick={handleUserClick}
            >
              <div className="text-right">
                <p className="text-sm font-medium text-graphite">{currentUser.displayName || "User"}</p>
                <p className="text-xs text-drift-gray">{currentUser.email}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-soft-amber/20 flex items-center justify-center">
                {currentUser.photoURL ? (
                  <Image
                    src={currentUser.photoURL || "/placeholder.svg"}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5 text-soft-amber" />
                )}
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
              >
                Sign Up
              </Link>
            </>
          )}
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 text-drift-gray hover:bg-pale-stone hover:text-soft-amber md:hidden"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>

<<<<<<< HEAD
      <WelcomeSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
=======
      <WelcomeSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        currentUser={currentUser}
        userType={userType}
      />
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    </header>
  )
}
