"use client"

import { useState } from "react"
import { DoctorTopNav } from "@/components/doctor-top-nav"
import { DoctorMobileNav } from "@/components/doctor-mobile-nav"
import { useMobile } from "@/hooks/use-mobile"
import { usePathname } from "next/navigation"

export default function DoctorLayout({ children }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const isMobile = useMobile()
  const pathname = usePathname()

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
  )
}
