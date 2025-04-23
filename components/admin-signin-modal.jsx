"use client"

import { useState, useRef, useEffect } from "react"
<<<<<<< HEAD
import { X, AlertCircle, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
=======
import { X, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

export function AdminSigninModal({ isOpen, onClose }) {
  const router = useRouter()
  const [startX, setStartX] = useState(null)
  const [offsetX, setOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const modalRef = useRef(null)

<<<<<<< HEAD
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

=======
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Reset offset when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setOffsetX(0)
<<<<<<< HEAD
      // Reset form state
      setEmail("")
      setPassword("")
      setError("")
=======
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    }
  }, [isOpen])

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleMouseDown = (e) => {
    setStartX(e.clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!isDragging || startX === null) return
    const currentX = e.touches[0].clientX
    const diff = currentX - startX
    setOffsetX(diff)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || startX === null) return
    const currentX = e.clientX
    const diff = currentX - startX
    setOffsetX(diff)
  }

  const handleTouchEnd = () => {
    if (Math.abs(offsetX) > 100) {
      onClose()
    } else {
      setOffsetX(0)
    }
    setIsDragging(false)
    setStartX(null)
  }

  const handleMouseUp = () => {
    if (Math.abs(offsetX) > 100) {
      onClose()
    } else {
      setOffsetX(0)
    }
    setIsDragging(false)
    setStartX(null)
  }

<<<<<<< HEAD
  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const auth = getAuth()
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Check if user has admin role in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))

      if (userDoc.exists() && userDoc.data().role === "admin") {
        // User is an admin, redirect to admin dashboard
        router.push("/admin/dashboard")
        onClose()
      } else {
        // User exists but is not an admin
        setError("You do not have administrator privileges")
        // Sign out the user since they're not an admin
        await auth.signOut()
      }
    } catch (error) {
      console.error("Admin login error:", error)

      // Handle specific error codes
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setError("Invalid email or password")
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later")
      } else {
        setError("Failed to sign in. Please try again")
      }
    } finally {
      setIsLoading(false)
    }
=======
  const handleContinue = () => {
    router.push("/admin/dashboard")
    onClose()
  }

  const handleLogout = () => {
    // In a real app, this would call an API to log the user out
    router.push("/login")
    onClose()
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg transition-transform"
        style={{
          transform: `translate(-50%, -50%) translateX(${offsetX}px)`,
          opacity: Math.max(0, 1 - Math.abs(offsetX) / 200),
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex items-center justify-between">
<<<<<<< HEAD
          <h2 className="text-xl font-semibold text-graphite">Admin Sign In</h2>
=======
          <h2 className="text-xl font-semibold text-graphite">Already Signed In</h2>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
          <button
            onClick={onClose}
            className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <AlertCircle className="h-10 w-10 text-soft-amber" />
          </div>
        </div>

        <div className="mt-4 text-center">
<<<<<<< HEAD
          <p className="text-lg font-medium text-graphite">Administrator Access Required</p>
          <p className="mt-2 text-drift-gray">Please enter your admin credentials to continue</p>
        </div>

        {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleAdminLogin} className="mt-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-graphite mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-drift-gray" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-earth-beige rounded-md focus:outline-none focus:ring-2 focus:ring-soft-amber focus:border-soft-amber"
                  placeholder="admin@smartcare.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-graphite mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-drift-gray" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-earth-beige rounded-md focus:outline-none focus:ring-2 focus:ring-soft-amber focus:border-soft-amber"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-drift-gray" />
                  ) : (
                    <Eye className="h-5 w-5 text-drift-gray" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2 text-center text-xs text-drift-gray italic">
            <p>Swipe left or right to dismiss</p>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-soft-amber/90 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2 disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
=======
          <p className="text-lg font-medium text-graphite">You are already signed in as an administrator</p>
          <p className="mt-2 text-drift-gray">Would you like to continue to the admin dashboard or sign out?</p>
        </div>

        <div className="mt-2 text-center text-xs text-drift-gray italic">
          <p>Swipe left or right to dismiss</p>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleLogout}
            className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
          >
            Sign Out
          </button>
          <button
            onClick={handleContinue}
            className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-soft-amber/90 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
          >
            Continue
          </button>
        </div>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
      </div>
    </>
  )
}
