"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, FileText, User, X } from "lucide-react"

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

<<<<<<< HEAD
  // Mock summary data - in a real app, this would come from the appointment
  const summary = appointment.summary || {
    diagnosis: "Regular check-up completed",
    recommendations: "Continue current medications, maintain healthy diet and exercise",
    prescriptions: ["No new prescriptions"],
    followUp: "6 months",
=======
  // Mock summary data - in a real app, this would come from the backend
  const summary = {
    diagnosis: "Seasonal allergies with mild upper respiratory symptoms",
    recommendations: "Over-the-counter antihistamines, nasal saline rinse, follow-up in 4 weeks if symptoms persist",
    prescriptions: ["Loratadine 10mg once daily", "Fluticasone nasal spray 50mcg 1-2 sprays per nostril daily"],
    followUp: "As needed, or in 4 weeks if symptoms persist",
    notes: "Patient reported improvement with previous treatment. Continue to monitor for any changes in symptoms.",
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
  }

  return (
    <>
      {/* Backdrop with animation */}
      <div
        id="summary-backdrop"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.3s ease-in-out" }}
      />

      {/* Modal with animation */}
      <div
        id="summary-content"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
        style={{ animation: "scaleIn 0.3s ease-in-out" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-graphite">Appointment Summary</h2>
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
<<<<<<< HEAD
              <h3 className="font-medium text-graphite">{appointment.doctorName || appointment.doctor}</h3>
            </div>
            <p className="ml-7 text-sm text-drift-gray">
              {appointment.specialty} • {appointment.type}
            </p>
=======
              <h3 className="font-medium text-graphite">{appointment.doctor}</h3>
            </div>
            <p className="ml-7 text-sm text-drift-gray">{appointment.specialty}</p>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
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

<<<<<<< HEAD
          <div className="space-y-3">
            <div className="rounded-md bg-blue-50 p-3">
              <p className="text-sm font-medium text-blue-800">Diagnosis</p>
              <p className="text-sm text-blue-700">{summary.diagnosis}</p>
            </div>

            <div className="rounded-md bg-green-50 p-3">
              <p className="text-sm font-medium text-green-800">Recommendations</p>
              <p className="text-sm text-green-700">{summary.recommendations}</p>
            </div>

            <div className="rounded-md bg-amber-50 p-3">
              <p className="text-sm font-medium text-amber-800">Prescriptions</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-amber-700">
=======
          <div className="space-y-3 rounded-md border border-pale-stone p-4">
            <div>
              <h4 className="font-medium text-graphite">Diagnosis</h4>
              <p className="text-sm text-drift-gray">{summary.diagnosis}</p>
            </div>

            <div>
              <h4 className="font-medium text-graphite">Recommendations</h4>
              <p className="text-sm text-drift-gray">{summary.recommendations}</p>
            </div>

            <div>
              <h4 className="font-medium text-graphite">Prescriptions</h4>
              <ul className="ml-5 list-disc text-sm text-drift-gray">
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
                {summary.prescriptions.map((prescription, index) => (
                  <li key={index}>{prescription}</li>
                ))}
              </ul>
            </div>

<<<<<<< HEAD
            <div className="flex items-start">
              <FileText className="mr-2 h-5 w-5 text-soft-amber" />
              <div>
                <p className="text-sm font-medium text-graphite">Follow-up</p>
                <p className="text-sm text-drift-gray">Recommended in {summary.followUp}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
=======
            <div>
              <h4 className="font-medium text-graphite">Follow-up</h4>
              <p className="text-sm text-drift-gray">{summary.followUp}</p>
            </div>

            {summary.notes && (
              <div>
                <h4 className="font-medium text-graphite">Additional Notes</h4>
                <p className="text-sm text-drift-gray">{summary.notes}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-2">
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
            <button
              onClick={handleClose}
              className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors duration-200 hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
            >
              Close
            </button>
<<<<<<< HEAD
=======
            <button className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2">
              <FileText className="mr-1 h-4 w-4 inline" />
              Download PDF
            </button>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
          </div>
        </div>
      </div>
    </>
  )
}
