"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Logo } from "@/components/logo"

export function Navbar({ onSidebarOpen }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const isMobile = useMobile()

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Logo href="/" />
          </div>

          {isMobile ? (
            <button
              onClick={onSidebarOpen}
              className="inline-flex h-10 items-center justify-center rounded-md p-2 text-drift-gray hover:bg-pale-stone hover:text-soft-amber focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          ) : (
            <nav className="flex items-center space-x-4">
              <Link
                href="/information?section=about"
                className="text-sm font-medium text-drift-gray hover:text-soft-amber"
              >
                About
              </Link>
              <Link
                href="/information?section=services"
                className="text-sm font-medium text-drift-gray hover:text-soft-amber"
              >
                Services
              </Link>
              <Link
                href="/information?section=doctors"
                className="text-sm font-medium text-drift-gray hover:text-soft-amber"
              >
                Doctors
              </Link>
              <Link
                href="/information?section=contact"
                className="text-sm font-medium text-drift-gray hover:text-soft-amber"
              >
                Contact
              </Link>
              <div className="ml-4 flex items-center space-x-2">
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-earth-beige bg-white px-4 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-soft-amber px-4 text-sm font-medium text-graphite transition-colors hover:bg-soft-amber/90 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
