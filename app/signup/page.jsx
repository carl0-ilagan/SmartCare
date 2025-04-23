"use client"

import { useState } from "react"
import Link from "next/link"
<<<<<<< HEAD
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, User, Stethoscope } from "lucide-react"
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      await signup(email, password, name, accountType)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Signup error:", error)
      setError(error.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
    // Redirect to appropriate dashboard
    if (accountType === "patient") {
      router.push("/dashboard")
    } else {
      router.push("/doctor/dashboard")
=======
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signInWithGoogle } from "@/lib/firebase"
import { SignupSuccessModal } from "@/components/signup-success-modal"

export default function SignupPage() {
  const router = useRouter()
  const [userType, setUserType] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successData, setSuccessData] = useState(null)

  const handleGoogleSignup = async () => {
    if (!userType) {
      setError("Please select whether you're a patient or a doctor")
      return
    }

    try {
      setLoading(true)
      setError("")

      const result = await signInWithGoogle(userType)

      // Show success modal
      setSuccessData({
        name: result.user.displayName,
        email: result.user.email,
        userType: userType,
      })
      setShowSuccessModal(true)

      // Redirect after a delay
      setTimeout(() => {
        if (userType === "patient") {
          router.push("/dashboard")
        } else if (userType === "doctor") {
          router.push("/doctor/dashboard")
        }
      }, 3000)
    } catch (err) {
      console.error("Error during Google signup:", err)
      setError(err.message)
    } finally {
      setLoading(false)
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    }
  }

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen flex-col bg-pale-stone">
      <div className="container flex flex-1 items-center justify-center px-4 py-12 md:px-6">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-graphite">Create an Account</h1>
            <p className="text-drift-gray">Join Smart Care for better healthcare experience</p>
          </div>
          <div className="rounded-lg border border-earth-beige bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

              {/* Demo notice */}
              {/* <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-600">
                <p className="font-medium">Demo Notice:</p>
                <p>This is a demo application. No real data will be stored.</p>
                <p>After signup, you'll be redirected to the appropriate dashboard.</p>
              </div> */}

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

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-graphite">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-graphite">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-graphite">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-10 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-drift-gray hover:text-graphite"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-graphite">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
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
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-soft-amber py-2 text-center font-medium text-graphite hover:bg-soft-amber/90 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2 disabled:opacity-70"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-earth-beige"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-drift-gray">Or continue with</span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full rounded-md border border-earth-beige bg-white py-2 text-center font-medium text-graphite hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                    <span className="ml-2">Google</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-drift-gray">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-soft-amber hover:underline">
              Sign in
            </Link>
=======
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 xl:px-12">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image src="/logo.svg" alt="SmartCare Logo" width={48} height={48} className="mx-auto h-12 w-12" />
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-graphite">Create your account</h2>
            <p className="mt-2 text-sm text-drift-gray">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-soft-amber hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-graphite">I am a:</p>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setUserType("patient")}
                  className={`flex-1 rounded-md border px-4 py-3 text-center text-sm font-medium transition-colors ${
                    userType === "patient"
                      ? "border-soft-amber bg-soft-amber/10 text-soft-amber"
                      : "border-earth-beige text-drift-gray hover:bg-pale-stone"
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("doctor")}
                  className={`flex-1 rounded-md border px-4 py-3 text-center text-sm font-medium transition-colors ${
                    userType === "doctor"
                      ? "border-soft-amber bg-soft-amber/10 text-soft-amber"
                      : "border-earth-beige text-drift-gray hover:bg-pale-stone"
                  }`}
                >
                  Doctor
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                <p>{error}</p>
              </div>
            )}

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading || !userType}
                className="flex w-full items-center justify-center rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite shadow-sm transition-colors hover:bg-pale-stone disabled:opacity-50"
              >
                <Image src="/google-logo.svg" alt="Google" width={20} height={20} className="mr-2 h-5 w-5" />
                Sign up with Google
              </button>
            </div>

            <div className="mt-6">
              <p className="text-center text-xs text-drift-gray">
                By signing up, you agree to our{" "}
                <Link href="#" className="font-medium text-soft-amber hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="font-medium text-soft-amber hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <SignupSuccessModal isOpen={showSuccessModal} onClose={handleSuccessModalClose} userType={accountType} />
=======
      {/* Right side - Image */}
      <div className="hidden relative lg:block lg:w-1/2">
        <div className="absolute inset-0 flex items-center justify-center bg-soft-amber/10">
          <div className="max-w-2xl p-12">
            <h2 className="text-4xl font-bold text-graphite">Your health journey starts here</h2>
            <p className="mt-4 text-xl text-drift-gray">
              Connect with healthcare professionals, manage appointments, and access your medical records all in one
              place.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="font-medium text-graphite">Virtual Consultations</h3>
                <p className="mt-1 text-sm text-drift-gray">Connect with doctors from the comfort of your home</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="font-medium text-graphite">Prescription Management</h3>
                <p className="mt-1 text-sm text-drift-gray">Keep track of your medications and refills</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="font-medium text-graphite">Medical Records</h3>
                <p className="mt-1 text-sm text-drift-gray">Access your health information anytime, anywhere</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="font-medium text-graphite">Secure Messaging</h3>
                <p className="mt-1 text-sm text-drift-gray">Communicate directly with your healthcare providers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SignupSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} userData={successData} />
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    </div>
  )
}
