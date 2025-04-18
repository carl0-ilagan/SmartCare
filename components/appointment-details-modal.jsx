"use client"
import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, User, X } from "lucide-react"

export function AppointmentDetailsModal({ isOpen, onClose, appointment, onCancel, onViewSummary }) {
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
    const backdrop = document.getElementById("details-backdrop")
    const modalContent = document.getElementById("details-content")

    if (backdrop) backdrop.style.animation = "fadeOut 0.3s ease-in-out forwards"
    if (modalContent) modalContent.style.animation = "scaleOut 0.3s ease-in-out forwards"

    setTimeout(() => {
      onClose()
    }, 280)
  }

  if (!isOpen && !isVisible) return null
  if (!appointment) return null

  const isUpcoming = appointment.status === "upcoming"
  const isCompleted = appointment.status === "completed"

  return (
    <>
      {/* Backdrop with animation */}
      <div
        id="details-backdrop"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.3s ease-in-out" }}
      />

      {/* Modal with animation */}
      <div
        id="details-content"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
        style={{ animation: "scaleIn 0.3s ease-in-out" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-graphite">Appointment Details</h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber transition-colors duration-200"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-pale-stone p-4">
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-soft-amber" />
              <h3 className="font-medium text-graphite">{appointment.patient}</h3>
            </div>
            <p className="ml-7 text-sm text-drift-gray">{appointment.type}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start">
              <Calendar className="mr-2 h-5 w-5 text-soft-amber" />
              <div>
                <p className="text-sm font-medium text-graphite">Date</p>
                <p className="text-sm text-drift-gray">{new Date(appointment.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="mr-2 h-5 w-5 text-soft-amber" />
              <div>
                <p className="text-sm font-medium text-graphite">Time</p>
                <p className="text-sm text-drift-gray">{appointment.time}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <MapPin className="mr-2 h-5 w-5 text-soft-amber" />
            <div>
              <p className="text-sm font-medium text-graphite">Location</p>
              <p className="text-sm text-drift-gray">{appointment.location || "Virtual Consultation (Video Call)"}</p>
            </div>
          </div>

          {appointment.notes && (
            <div className="rounded-md bg-pale-stone/50 p-3">
              <p className="text-sm font-medium text-graphite">Notes</p>
              <p className="text-sm text-drift-gray">{appointment.notes}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={handleClose}
              className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors duration-200 hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
            >
              Close
            </button>

            {isUpcoming && (
              <button
                onClick={() => {
                  onCancel(appointment)
                  handleClose()
                }}
                className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Cancel Appointment
              </button>
            )}

            {isCompleted && (
              <button
                onClick={() => {
                  onViewSummary(appointment)
                  handleClose()
                }}
                className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
              >
                View Summary
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
