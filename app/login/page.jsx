"use client"

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
    }
  }

  return (
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
                      <input
                        id="email"
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
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-earth-beige text-soft-amber focus:ring-soft-amber"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-drift-gray">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={() => setShowResetForm(true)}
                        className="font-medium text-soft-amber hover:underline"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
