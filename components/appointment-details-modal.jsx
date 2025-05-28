"use client"
import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, User, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { markAppointmentNotificationsAsRead, hasSummary } from "@/lib/appointment-utils"

// Add a status badge component to show the appointment status more clearly
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: "bg-amber-100", text: "text-amber-800", label: "Pending" },
    approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
    completed: { bg: "bg-blue-100", text: "text-blue-800", label: "Completed" },
    cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`rounded-full ${config.bg} px-2.5 py-0.5 text-xs font-medium ${config.text}`}>{config.label}</span>
  )
}

export function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onCancel,
  onViewSummary,
  fromHistory = false,
}) {
  const { user, userRole } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)

      // Mark notifications as read when opening details
      if (appointment && user) {
        markAppointmentNotificationsAsRead(appointment.id, userRole)
      }
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen, appointment, user, userRole])

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

  const isUpcoming = appointment.status === "approved" || appointment.status === "pending"
  const isCompleted = appointment.status === "completed"
  const isPending = appointment.status === "pending"
  const isApproved = appointment.status === "approved"

  // Check if the appointment has a summary
  const appointmentHasSummary = hasSummary(appointment)

  // Determine if the current user is the doctor or patient
  const isDoctor = userRole === "doctor"
  const isPatient = userRole === "patient"

  // Get the name of the other party
  const otherPartyName = isDoctor ? appointment.patientName || "Patient" : appointment.doctorName || "Doctor"

  // Get the specialty if viewing as patient
  const specialty = isPatient ? appointment.specialty || "" : ""

  return (
    <>
      {/* Backdrop with animation */}
      <div
        id="details-backdrop"
        className="fixed inset-0 z-50 bg-black/50"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.2s ease-in-out forwards" }}
      />

      {/* Modal with animation - Fixed to scale from center */}
      <div
        id="details-content"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
        style={{
          animation: "modalScaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
          opacity: 0,
          transform: "translate(-50%, -50%) scale(0.95)",
        }}
      >
        <div className="flex items-center justify-between">
          {/* Add the StatusBadge to the appointment details display */}
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-semibold text-graphite mr-2">Appointment Details</h3>
            {appointment && <StatusBadge status={appointment.status} />}
          </div>
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
              <h3 className="font-medium text-graphite">{otherPartyName}</h3>
            </div>
            <p className="ml-7 text-sm text-drift-gray">
              {specialty ? `${specialty} • ` : ""}
              {appointment.type}
            </p>
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

          {/* Doctor's note (if any and appointment is approved) */}
          {appointment.note && (isApproved || isCompleted) && (
            <div className="rounded-md bg-green-50 p-3">
              <p className="text-sm font-medium text-green-800">Doctor's Note</p>
              <p className="text-sm text-green-700">{appointment.note}</p>
            </div>
          )}

          {/* Cancellation reason (if cancelled) */}
          {appointment.status === "cancelled" && appointment.note && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">Cancellation Reason</p>
              <p className="text-sm text-red-700">{appointment.note}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={handleClose}
              className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors duration-200 hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
            >
              Close
            </button>

            {/* Only show cancel button if not viewing from history and appointment is upcoming */}
            {isUpcoming && onCancel && !fromHistory && (
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

            {isCompleted && onViewSummary && (
              <>
                {appointmentHasSummary ? (
                  <button
                    onClick={() => {
                      onViewSummary(appointment)
                      handleClose()
                    }}
                    className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
                  >
                    View Summary
                  </button>
                ) : (
                  <button
                    disabled
                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
                    title="Summary not available yet"
                  >
                    No Summary Available
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
