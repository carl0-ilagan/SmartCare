"use client"

import { useEffect, useState } from "react"
import { CheckCircle, X } from "lucide-react"

<<<<<<< HEAD
export function AvailabilitySuccessModal({ isOpen, onClose, message, className = "" }) {
=======
export function AvailabilitySuccessModal({ isOpen, onClose, message }) {
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
  const [isVisible, setIsVisible] = useState(false)

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen && !isVisible) return null

<<<<<<< HEAD
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-graphite">Success</h2>
          <button
            onClick={onClose}
=======
  // Handle closing with animation
  const handleClose = () => {
    const backdrop = document.getElementById("availability-modal-backdrop")
    const modalContent = document.getElementById("availability-modal-content")

    if (backdrop) backdrop.style.animation = "fadeOut 0.3s ease-in-out forwards"
    if (modalContent) modalContent.style.animation = "scaleOut 0.3s ease-in-out forwards"

    setTimeout(() => {
      onClose()
    }, 280)
  }

  return (
    <>
      {/* Backdrop with animation */}
      <div
        id="availability-modal-backdrop"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.3s ease-in-out" }}
      />

      {/* Modal with animation */}
      <div
        id="availability-modal-content"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
        style={{ animation: "scaleIn 0.3s ease-in-out" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-graphite">Success</h2>
          <button
            onClick={handleClose}
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
            className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber transition-colors duration-200"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center justify-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <p className="text-center text-graphite">{message || "Your availability has been updated successfully!"}</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
<<<<<<< HEAD
            onClick={onClose}
=======
            onClick={handleClose}
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
            className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
<<<<<<< HEAD
    </div>
=======
    </>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
  )
}
