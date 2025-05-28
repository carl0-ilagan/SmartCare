"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AdminSigninModal } from "@/components/admin-signin-modal"
import { WelcomeModal } from "@/components/welcome-modal"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const router = useRouter()
  const { login, signInWithGoogle, userRole, user } = useAuth()

  // Check if admin is already signed in (simulated)
  useEffect(() => {
    // This would normally check a token or session
    const checkAdminSession = () => {
      // For demo purposes, we'll show the modal if the URL has a query param
      if (window.location.search.includes("admin=true")) {
        setShowAdminModal(true)
      }
    }

    checkAdminSession()
  }, [])

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && userRole) {
      if (userRole === "patient") {
        router.push("/dashboard")
      } else if (userRole === "doctor") {
        router.push("/doctor/dashboard")
      } else if (userRole === "admin") {
        router.push("/admin/dashboard")
      }
    }
  }, [user, userRole, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signInWithGoogle()
      // Only show welcome modal if sign-in was successful
      if (result) {
        setShowWelcomeModal(true)
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
      setError("Failed to sign in with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false)
    // Redirect to appropriate dashboard
    if (userRole === "patient") {
      router.push("/dashboard")
    } else if (userRole === "doctor") {
      router.push("/doctor/dashboard")
    } else if (userRole === "admin") {
      router.push("/admin/dashboard")
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithGoogle()
      // Only show welcome modal if sign-in was successful
      if (result) {
        setShowWelcomeModal(true)
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
      setError("Failed to sign in with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-pale-stone">
      {/* Admin already signed in modal */}
      <AdminSigninModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />

      {/* Welcome modal */}
      {showWelcomeModal && (
        <WelcomeModal isOpen={showWelcomeModal} onClose={handleWelcomeModalClose} userType={userRole} />
      )}

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left side - Login form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-soft-amber">Smart</span>
                  <span className="text-3xl font-bold text-graphite">Care</span>
                </div>
                <p className="text-drift-gray mt-2">Your Health, Our Priority</p>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-2xl font-bold text-graphite mb-6">Sign In</h1>

              {error && <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm">{error}</div>}

              <div className="mb-6 text-center">
                <p className="text-drift-gray">Sign in with your Google account to access Smart Care</p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-earth-beige rounded-md shadow-sm text-sm font-medium text-graphite bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-soft-amber disabled:opacity-70"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-drift-gray">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-soft-amber hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Animation */}
        <div className="hidden md:block md:w-1/2 bg-soft-amber/10">
          <div className="h-full flex items-center justify-center p-8">
            <div className="max-w-lg w-full flex flex-col items-center justify-center relative">
              {/* Animated lock and hand */}
              <div className="relative h-64 w-full flex items-center justify-center mb-8">
                {/* Floating lock */}
                <div id="login-lock" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-500">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-50 shadow-lg">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="6" y="10" width="12" height="8" rx="2" fill="#FBBF24"/>
                      <rect x="9" y="6" width="6" height="6" rx="3" fill="#FDE68A"/>
                    </svg>
                  </div>
                </div>
                {/* Waving hand */}
                <div id="login-hand" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-transform duration-500" style={{ transform: 'translate(-50%, -120%)' }}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                    <span role="img" aria-label="waving hand" className="text-4xl animate-wave">👋</span>
                  </div>
                </div>
                {/* Floating particles */}
                <div className="absolute -top-4 right-10 animate-float-slow">
                  <div className="bg-soft-amber/10 rounded-full p-1.5">
                    <div className="h-3 w-3 rounded-full bg-soft-amber/30"></div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-10 animate-float-slow-delay">
                  <div className="bg-soft-amber/10 rounded-full p-1.5">
                    <div className="h-3 w-3 rounded-full bg-soft-amber/30"></div>
                  </div>
                </div>
                <div className="absolute -bottom-8 right-16 animate-float-slow-delay-more">
                  <div className="bg-soft-amber/10 rounded-full p-1.5">
                    <div className="h-3 w-3 rounded-full bg-soft-amber/30"></div>
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-graphite mb-4">Welcome Back!</h2>
              <p className="text-drift-gray mb-8">
                Sign in to access your Smart Care dashboard and manage your health with ease.
              </p>
            </div>
          </div>
          <style jsx global>{`
            @keyframes float-slow {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            @keyframes float-slow-delay {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            @keyframes float-slow-delay-more {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
            .animate-float-slow-delay { animation: float-slow-delay 4s ease-in-out infinite 1s; }
            .animate-float-slow-delay-more { animation: float-slow-delay-more 4s ease-in-out infinite 2s; }
            @keyframes wave {
              0% { transform: rotate(0deg); }
              10% { transform: rotate(14deg); }
              20% { transform: rotate(-8deg); }
              30% { transform: rotate(14deg); }
              40% { transform: rotate(-4deg); }
              50% { transform: rotate(10deg); }
              60% { transform: rotate(0deg); }
              100% { transform: rotate(0deg); }
            }
            .animate-wave { animation: wave 2s infinite; display: inline-block; }
          `}</style>
        </div>
      </div>
    </div>
  )
}
