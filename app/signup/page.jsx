"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Stethoscope } from "lucide-react"
import { SignupSuccessModal } from "@/components/signup-success-modal"
import { useAuth } from "@/contexts/auth-context"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [accountType, setAccountType] = useState("patient")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const router = useRouter()
  const { signup, signInWithGoogle } = useAuth()

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithGoogle(accountType)
      // Only show success modal if sign-up was successful
      if (result) {
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error("Google signup error:", error)
      setError(error.message || "Failed to sign up with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    // Redirect to waiting approval page
    router.push("/waiting-approval")
  }

  return (
    <div className="flex min-h-screen flex-col bg-pale-stone">
      <div className="container flex flex-1 items-center justify-center px-4 py-12 md:px-6">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-graphite">Create an Account</h1>
            <p className="text-drift-gray">Join Smart Care for better healthcare experience</p>
          </div>
          <div className="rounded-lg border border-earth-beige bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

              <div className="space-y-2">
                <label className="text-sm font-medium text-graphite">Account Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="radio"
                      id="patient"
                      name="accountType"
                      value="patient"
                      checked={accountType === "patient"}
                      onChange={() => setAccountType("patient")}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor="patient"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-earth-beige bg-white p-4 hover:bg-pale-stone hover:text-soft-amber peer-checked:border-soft-amber peer-checked:text-soft-amber"
                    >
                      <User className="mb-3 h-8 w-8" />
                      <span className="text-sm font-medium">Patient</span>
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="doctor"
                      name="accountType"
                      value="doctor"
                      checked={accountType === "doctor"}
                      onChange={() => setAccountType("doctor")}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor="doctor"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-earth-beige bg-white p-4 hover:bg-pale-stone hover:text-soft-amber peer-checked:border-soft-amber peer-checked:text-soft-amber"
                    >
                      <Stethoscope className="mb-3 h-8 w-8" />
                      <span className="text-sm font-medium">Doctor</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 rounded border-earth-beige text-soft-amber focus:ring-soft-amber"
                />
                <label htmlFor="terms" className="text-xs text-drift-gray">
                  I agree to the{" "}
                  <Link href="/information?section=terms" className="text-soft-amber hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/information?section=privacy" className="text-soft-amber hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
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
                {isLoading ? "Creating account..." : "Sign up with Google"}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-earth-beige"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-drift-gray">Or continue with</span>
                </div>
              </div>
              <div className="mt-6">{/* Existing Google Sign-in Button - To be removed */}</div>
            </div>
          </div>
          <div className="text-center text-sm text-drift-gray">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-soft-amber hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <SignupSuccessModal isOpen={showSuccessModal} onClose={handleSuccessModalClose} userType={accountType} />
    </div>
  )
}
