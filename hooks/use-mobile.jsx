"use client"

import { useState, useEffect } from "react"

<<<<<<< HEAD
=======
// Export the hook as a named export
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
<<<<<<< HEAD
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
=======
    // Only run on client side
    if (typeof window !== "undefined") {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      // Initial check
      checkIfMobile()

      // Add event listener
      window.addEventListener("resize", checkIfMobile)

      // Clean up
      return () => window.removeEventListener("resize", checkIfMobile)
    }

    return undefined
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
  }, [])

  return isMobile
}
<<<<<<< HEAD

// Make sure we have a default export as well
export default useMobile
=======
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
