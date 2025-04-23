"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
import { DoctorTopNav } from "@/components/doctor-top-nav"
import { DoctorMobileNav } from "@/components/doctor-mobile-nav"
import { ProtectedRoute } from "@/components/protected-route"
import { useMobile } from "@/hooks/use-mobile"
import { usePathname } from "next/navigation"
import CallNotification from "@/components/call-notification"
=======
import { useState } from "react"
import { DoctorTopNav } from "@/components/doctor-top-nav"
import { DoctorMobileNav } from "@/components/doctor-mobile-nav"
import { useMobile } from "@/hooks/use-mobile"
import { usePathname } from "next/navigation"
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

export default function DoctorLayout({ children }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const isMobile = useMobile()
  const pathname = usePathname()
<<<<<<< HEAD
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)
  const [currentPath, setCurrentPath] = useState(pathname)
  const [content, setContent] = useState(children)

  // Check if we're on the chat page
  const isMessagesPage = pathname === "/doctor/chat"

  // Handle page transitions
  useEffect(() => {
    if (pathname !== currentPath) {
      setIsPageTransitioning(true)

      // Short delay to allow animation to play
      const timer = setTimeout(() => {
        setContent(children)
        setCurrentPath(pathname)
        setIsPageTransitioning(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [pathname, children, currentPath])

  // Don't show navigation on chat page for full screen experience
  if (isMessagesPage) {
    return <ProtectedRoute requiredRole="doctor">{children}</ProtectedRoute>
  }

  return (
    <ProtectedRoute requiredRole="doctor">
      <div className="min-h-screen bg-pale-stone">
        <DoctorTopNav showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
        <main className="container mx-auto px-4 pb-20 pt-24 md:px-6 md:pb-12">
          <div className={`${isPageTransitioning ? "opacity-0" : "page-transition-enter"}`}>{content}</div>
        </main>
        {isMobile && <DoctorMobileNav />}
        <CallNotification />
      </div>
    </ProtectedRoute>
=======

  // Don't show navigation on chat page
  const isMessagesPage = pathname === "/doctor/chat"

  return (
    <div className="min-h-screen bg-pale-stone">
      {!isMessagesPage && <DoctorTopNav showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />}

      <main className={`${isMessagesPage ? "" : "container mx-auto px-4 pb-20 pt-24 md:px-6 md:pb-12"}`}>
        {children}
      </main>

      {isMobile && !isMessagesPage && <DoctorMobileNav />}
    </div>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
  )
}
