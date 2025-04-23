"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
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
      await login(email, password)
      setShowWelcomeModal(true)
    } catch (error) {
      console.error("Login error:", error)
      setError("Invalid email or password")
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
=======
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signInWithGoogle, loginWithEmailAndPassword, resetPassword } from "@/lib/firebase"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resetSent, setResetSent] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError("")

      const result = await signInWithGoogle()

      // Redirect based on user type
      if (result.userType === "patient") {
        router.push("/dashboard")
      } else if (result.userType === "doctor") {
        router.push("/doctor/dashboard")
      } else if (result.userType === "admin") {
        router.push("/admin/dashboard")
      }
    } catch (err) {
      console.error("Error during Google login:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    try {
      setLoading(true)
      setError("")

      await loginWithEmailAndPassword(email, password)

      // Redirect will be handled by the auth context
    } catch (err) {
      console.error("Error during email login:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required")
      return
    }

    try {
      setLoading(true)
      setError("")

      await resetPassword(email)
      setResetSent(true)
    } catch (err) {
      console.error("Error during password reset:", err)
      setError(err.message)
    } finally {
      setLoading(false)
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    }
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex flex-col bg-pale-stone">
      {/* Admin already signed in modal */}
      <AdminSigninModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />

      {/* Welcome modal */}
      <WelcomeModal isOpen={showWelcomeModal} onClose={handleWelcomeModalClose} userType={userRole} />

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

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-graphite mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-drift-gray" />
                      </div>
=======
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 xl:px-12">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image src="/logo.svg" alt="SmartCare Logo" width={48} height={48} className="mx-auto h-12 w-12" />
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-graphite">Sign in to your account</h2>
            <p className="mt-2 text-sm text-drift-gray">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-soft-amber hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                <p>{error}</p>
              </div>
            )}

            {resetSent && (
              <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
                <p>Password reset link has been sent to your email.</p>
              </div>
            )}

            {showResetForm ? (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-graphite">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="reset-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-earth-beige px-3 py-2 placeholder-drift-gray/60 shadow-sm focus:border-soft-amber focus:outline-none focus:ring-soft-amber sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="flex w-full justify-center rounded-md border border-transparent bg-soft-amber px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowResetForm(false)}
                    className="text-sm font-medium text-soft-amber hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite shadow-sm transition-colors hover:bg-pale-stone disabled:opacity-50"
                  >
                    <Image src="/google-logo.svg" alt="Google" width={20} height={20} className="mr-2 h-5 w-5" />
                    Sign in with Google
                  </button>
                </div>

                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-earth-beige" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-drift-gray">Or continue with</span>
                  </div>
                </div>

                <form onSubmit={handleEmailLogin} className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-graphite">
                      Email address
                    </label>
                    <div className="mt-1">
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
                      <input
                        id="email"
                        name="email"
                        type="email"
<<<<<<< HEAD
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-earth-beige rounded-md focus:outline-none focus:ring-2 focus:ring-soft-amber focus:border-soft-amber"
                        placeholder="Enter your email"
                        required
=======
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full appearance-none rounded-md border border-earth-beige px-3 py-2 placeholder-drift-gray/60 shadow-sm focus:border-soft-amber focus:outline-none focus:ring-soft-amber sm:text-sm"
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
                      />
                    </div>
                  </div>

                  <div>
<<<<<<< HEAD
                    <label htmlFor="password" className="block text-sm font-medium text-graphite mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-drift-gray" />
                      </div>
                      <input
                        id="password"
                        name="password"
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
=======
                    <label htmlFor="password" className="block text-sm font-medium text-graphite">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full appearance-none rounded-md border border-earth-beige px-3 py-2 placeholder-drift-gray/60 shadow-sm focus:border-soft-amber focus:outline-none focus:ring-soft-amber sm:text-sm"
                      />
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
<<<<<<< HEAD
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="h-4 w-4 text-soft-amber focus:ring-soft-amber border-earth-beige rounded"
=======
                        className="h-4 w-4 rounded border-earth-beige text-soft-amber focus:ring-soft-amber"
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-drift-gray">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
<<<<<<< HEAD
                      <Link href="/forgot-password" className="text-soft-amber hover:underline">
                        Forgot password?
                      </Link>
=======
                      <button
                        type="button"
                        onClick={() => setShowResetForm(true)}
                        className="font-medium text-soft-amber hover:underline"
                      >
                        Forgot your password?
                      </button>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
<<<<<<< HEAD
                      disabled={isLoading}
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-soft-amber hover:bg-soft-amber/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-soft-amber disabled:opacity-70"
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-earth-beige"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-drift-gray">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-2 px-4 border border-earth-beige rounded-md shadow-sm text-sm font-medium text-graphite bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-soft-amber disabled:opacity-70"
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
                    Sign in with Google
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-drift-gray">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-soft-amber hover:underline">
                    Sign up
                  </Link>
                </p>
                <div className="mt-2 text-center">
                  <p className="text-xs text-drift-gray">
                    <button onClick={() => setShowAdminModal(true)} className="text-soft-amber hover:underline">
                      Administrator Login
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 bg-soft-amber/10">
          <div className="h-full flex items-center justify-center p-8">
            <div className="max-w-lg text-center">
              <h2 className="text-3xl font-bold text-graphite mb-4">Welcome to Smart Care</h2>
              <p className="text-drift-gray mb-8">
                Your comprehensive healthcare platform connecting patients and doctors for better healthcare management.
              </p>
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Healthcare illustration"
                className="mx-auto rounded-lg shadow-lg"
              />
=======
                      disabled={loading || !email || !password}
                      className="flex w-full justify-center rounded-md border border-transparent bg-soft-amber px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2 disabled:opacity-50"
                    >
                      {loading ? "Signing in..." : "Sign in"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden relative lg:block lg:w-1/2">
        <div className="absolute inset-0 flex items-center justify-center bg-soft-amber/10">
          <div className="max-w-2xl p-12">
            <h2 className="text-4xl font-bold text-graphite">Welcome back to SmartCare</h2>
            <p className="mt-4 text-xl text-drift-gray">
              Your health journey continues here. Sign in to access your personalized healthcare experience.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="font-medium text-graphite">Upcoming Appointments</h3>
                <p className="mt-1 text-sm text-drift-gray">View and manage your scheduled appointments</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="font-medium text-graphite">Message Your Doctor</h3>
                <p className="mt-1 text-sm text-drift-gray">Communicate securely with your healthcare providers</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="font-medium text-graphite">View Prescriptions</h3>
                <p className="mt-1 text-sm text-drift-gray">Access your current medications and refill requests</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="font-medium text-graphite">Health Records</h3>
                <p className="mt-1 text-sm text-drift-gray">Review your medical history and test results</p>
              </div>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
