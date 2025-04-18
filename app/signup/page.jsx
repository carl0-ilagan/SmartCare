"use client"

import { useState } from "react"
import Link from "next/link"
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
          </div>
        </div>
      </div>

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
    </div>
  )
}
