"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"
import { User } from "lucide-react"

export function WelcomeSidebar({ open, onOpenChange, currentUser, userType }) {
  const isMobile = useMobile()
  const dropdownRef = useRef(null)

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onOpenChange])

  // Prevent scrolling when dropdown is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])

  const handleUserProfileClick = () => {
    if (!currentUser) return

    // Redirect based on user type
    if (userType === "patient") {
      window.location.href = "/dashboard"
      onOpenChange(false)
    } else if (userType === "doctor") {
      window.location.href = "/doctor/dashboard"
      onOpenChange(false)
    }
  }

  return (
    <>
      {/* Full-width mobile dropdown */}
      <div
        className={`fixed inset-x-0 top-[60px] z-50 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        ref={dropdownRef}
      >
        <nav className="container mx-auto px-4 py-3">
          {/* Add user information if logged in */}
          {currentUser && (
            <div className="mb-6 border-b border-earth-beige/30 pb-4 cursor-pointer" onClick={handleUserProfileClick}>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-soft-amber/20 flex items-center justify-center overflow-hidden">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL || "/placeholder.svg"}
                      alt="Profile"
                      className="h-10 w-10 object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-soft-amber" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-graphite">{currentUser.displayName || "User"}</p>
                  <p className="text-sm text-drift-gray">{currentUser.email}</p>
                  <p className="text-xs text-soft-amber mt-1">
                    {userType === "patient"
                      ? "Go to Patient Dashboard"
                      : userType === "doctor"
                        ? "Go to Doctor Dashboard"
                        : ""}
                  </p>
                </div>
              </div>
            </div>
          )}

          <ul className="space-y-3 divide-y divide-earth-beige/30">
            {[
              { href: "/", label: "Home" },
              { href: "/information?section=about", label: "About" },
              { href: "/information?section=services", label: "Services" },
              { href: "/information?section=doctors", label: "Doctors" },
              { href: "/information?section=contact", label: "Contact" },
            ].map((item, index) => (
              <li
                key={index}
                className="transform transition-all duration-300"
                style={{
                  transitionDelay: open ? `${index * 50}ms` : "0ms",
                  transform: open ? "translateY(0)" : "translateY(-10px)",
                  opacity: open ? 1 : 0,
                }}
              >
                <Link
                  href={item.href}
                  className="block py-3 text-base font-medium text-graphite hover:text-soft-amber transition-colors duration-200"
                  onClick={() => onOpenChange(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {!currentUser && (
            <div className="mt-6 grid grid-cols-2 gap-4 py-4 border-t border-earth-beige/30">
              <Link
                href="/login"
                className="block w-full rounded-md border border-earth-beige bg-white px-4 py-2.5 text-center text-base font-medium text-graphite transition-colors hover:bg-pale-stone"
                onClick={() => onOpenChange(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block w-full rounded-md bg-soft-amber px-4 py-2.5 text-center text-base font-medium text-white transition-colors hover:bg-soft-amber/90"
                onClick={() => onOpenChange(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Backdrop for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          style={{ opacity: open ? 1 : 0 }}
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
