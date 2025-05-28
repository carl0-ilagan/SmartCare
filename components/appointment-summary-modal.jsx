"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, Stethoscope, ClipboardList, Pill, CalendarClock } from "lucide-react"

export function AppointmentSummaryModal({ isOpen, onClose, appointment }) {
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
    const backdrop = document.getElementById("summary-backdrop")
    const modalContent = document.getElementById("summary-content")

    if (backdrop) backdrop.style.animation = "fadeOut 0.3s ease-in-out forwards"
    if (modalContent) modalContent.style.animation = "scaleOut 0.3s ease-in-out forwards"

    setTimeout(() => {
      onClose()
    }, 280)
  }

  if (!isOpen && !isVisible) return null
  if (!appointment) return null

  // Check if summary exists
  const summary = appointment.summary || {}
  const hasSummaryData = !!(
    summary.diagnosis ||
    summary.recommendations ||
    (summary.prescriptions && summary.prescriptions.length > 0) ||
    summary.followUp
  )

  return (
    <>
      {/* Backdrop with animation */}
      <div
        id="summary-backdrop"
        className="fixed inset-0 z-50 bg-black/50"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.2s ease-in-out forwards" }}
      />

      {/* Modal with animation */}
      <div
        id="summary-content"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
        style={{
          animation: "modalScaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
          opacity: 0,
          transform: "translate(-50%, -50%) scale(0.95)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-graphite">Appointment Summary</h3>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber transition-colors duration-200"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-pale-stone p-4">
            <h4 className="font-medium text-graphite">
              {appointment.doctorName ? `Dr. ${appointment.doctorName}` : "Doctor"}
            </h4>
            <p className="text-sm text-drift-gray">
              {appointment.specialty || "Specialist"} • {appointment.type || "Consultation"}
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
                <p className="text-sm text-drift-gray">{appointment.time || "Not specified"}</p>
              </div>
            </div>
          </div>

          {hasSummaryData ? (
            <>
              {summary.diagnosis && (
                <div className="flex items-start">
                  <Stethoscope className="mr-2 h-5 w-5 text-soft-amber" />
                  <div>
                    <p className="text-sm font-medium text-graphite">Diagnosis</p>
                    <p className="text-sm text-drift-gray">{summary.diagnosis}</p>
                  </div>
                </div>
              )}

              {summary.recommendations && (
                <div className="flex items-start">
                  <ClipboardList className="mr-2 h-5 w-5 text-soft-amber" />
                  <div>
                    <p className="text-sm font-medium text-graphite">Recommendations</p>
                    <p className="text-sm text-drift-gray">{summary.recommendations}</p>
                  </div>
                </div>
              )}

              {summary.prescriptions && summary.prescriptions.length > 0 ? (
                <div className="flex items-start">
                  <Pill className="mr-2 h-5 w-5 text-soft-amber" />
                  <div>
                    <p className="text-sm font-medium text-graphite">Prescriptions</p>
                    <ul className="mt-1 space-y-1 text-sm text-drift-gray">
                      {summary.prescriptions.map((prescription, index) => (
                        <li key={index}>{prescription}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex items-start">
                  <Pill className="mr-2 h-5 w-5 text-soft-amber" />
                  <div>
                    <p className="text-sm font-medium text-graphite">Prescriptions</p>
                    <p className="text-sm text-drift-gray">No new prescriptions</p>
                  </div>
                </div>
              )}

              {summary.followUp && (
                <div className="flex items-start">
                  <CalendarClock className="mr-2 h-5 w-5 text-soft-amber" />
                  <div>
                    <p className="text-sm font-medium text-graphite">Follow-up</p>
                    <p className="text-sm text-drift-gray">{summary.followUp}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-md bg-amber-50 p-4 text-center">
              <p className="text-sm text-amber-800">No summary information is available for this appointment yet.</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleClose}
              className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors duration-200 hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
