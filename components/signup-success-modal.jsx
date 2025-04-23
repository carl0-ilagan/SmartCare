"use client"

<<<<<<< HEAD
import { useState, useEffect, useRef } from "react"
import { CheckCircle, X } from "lucide-react"
import Link from "next/link"

export function SignupSuccessModal({ isOpen, onClose, userType = "patient", userName = "" }) {
  const [startX, setStartX] = useState(null)
  const [offsetX, setOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const modalRef = useRef(null)

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
          <h2 className="text-xl font-semibold text-graphite">Account Created!</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-lg font-medium text-graphite">
            {userType === "patient"
              ? `Welcome to Smart Care, ${userName || "Patient"}!`
              : `Welcome to Smart Care, Dr. ${userName || "Doctor"}!`}
          </p>
          <p className="mt-2 text-drift-gray">
            {userType === "patient"
              ? "Your patient account has been successfully created. You can now access all our healthcare services."
              : "Your doctor account has been successfully created. You can now start providing care through our platform."}
          </p>
        </div>

        <div className="mt-2 text-center text-xs text-drift-gray italic">
          <p>Swipe left or right to dismiss</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="rounded-md bg-soft-amber px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-soft-amber/90 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
          >
            Get Started
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-drift-gray">
          {userType === "patient" ? (
            <p>
              Need help?{" "}
              <Link href="/dashboard/help" className="text-soft-amber hover:underline">
                Visit our help center
              </Link>
            </p>
          ) : (
            <p>
              Need help?{" "}
              <Link href="/doctor/help" className="text-soft-amber hover:underline">
                Visit our help center
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
=======
import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { CheckCircle } from "lucide-react"

export function SignupSuccessModal({ isOpen, onClose, userData }) {
  if (!userData) return null

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <Dialog.Title as="h3" className="mt-4 text-lg font-medium leading-6 text-graphite">
                    Account Created Successfully!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-drift-gray">
                      Welcome to SmartCare, {userData.name}! Your account has been created as a{" "}
                      <span className="font-medium">{userData.userType}</span>.
                    </p>
                  </div>

                  <div className="mt-4 w-full rounded-md bg-pale-stone p-4 text-left">
                    <p className="text-sm font-medium text-graphite">Account Details:</p>
                    <ul className="mt-2 space-y-1 text-sm text-drift-gray">
                      <li>
                        <span className="font-medium">Name:</span> {userData.name}
                      </li>
                      <li>
                        <span className="font-medium">Email:</span> {userData.email}
                      </li>
                      <li>
                        <span className="font-medium">Account Type:</span> {userData.userType}
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 text-sm text-drift-gray">
                    <p>You will be redirected to your dashboard in a moment...</p>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-soft-amber px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-soft-amber focus-visible:ring-offset-2"
                      onClick={onClose}
                    >
                      Continue to Dashboard
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
  )
}
