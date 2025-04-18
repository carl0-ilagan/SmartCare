"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function CancelAppointmentModal({ isOpen, onClose, appointment, onConfirm }) {
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

  // Handle closing with animation
  const handleClose = () => {
    const backdrop = document.getElementById("cancel-backdrop")
    const modalContent = document.getElementById("cancel-content")

    if (backdrop) backdrop.style.animation = "fadeOut 0.3s ease-in-out forwards"
    if (modalContent) modalContent.style.animation = "scaleOut 0.3s ease-in-out forwards"

    setTimeout(() => {
      onClose()
    }, 280)
  }

  if (!isOpen && !isVisible) return null
  if (!appointment) return null

  return (
    <>
      {/* Backdrop with animation */}
      <div
        id="cancel-backdrop"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.3s ease-in-out" }}
      />

      {/* Modal with animation */}
      <div
        id="cancel-content"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
        style={{ animation: "scaleIn 0.3s ease-in-out" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-graphite">Cancel Appointment</h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber transition-colors duration-200"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="mt-4">
          <p className="text-drift-gray">
            Are you sure you want to cancel the appointment with{" "}
            <span className="font-medium text-graphite">{appointment.patient}</span> on{" "}
            <span className="font-medium text-graphite">
              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
            </span>
            ?
          </p>

          <div className="mt-2 rounded-md bg-pale-stone p-3">
            <p className="text-sm text-drift-gray">
              <span className="font-medium">Note:</span> Please notify the patient about this cancellation. They will
              receive an automatic notification, but a personal follow-up is recommended.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors duration-200 hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
          >
            Keep Appointment
          </button>
          <button
            onClick={() => {
              onConfirm(appointment)
            }}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    </>
  )
}
