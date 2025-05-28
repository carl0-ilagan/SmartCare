"use client"

import { useState, useEffect } from "react"
import { X, Plus, Minus } from "lucide-react"
import { updateAppointmentSummary } from "@/lib/appointment-utils"

export function AppointmentAddSummaryModal({ isOpen, onClose, appointment, onSummaryAdded }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Form state
  const [diagnosis, setDiagnosis] = useState("")
  const [recommendations, setRecommendations] = useState("")
  const [prescriptions, setPrescriptions] = useState([""])
  const [followUp, setFollowUp] = useState("")

  // Initialize form with existing data if available
  useEffect(() => {
    if (appointment && appointment.summary) {
      const { summary } = appointment
      if (summary.diagnosis) setDiagnosis(summary.diagnosis)
      if (summary.recommendations) setRecommendations(summary.recommendations)
      if (summary.prescriptions && summary.prescriptions.length > 0) {
        setPrescriptions(summary.prescriptions)
      }
      if (summary.followUp) setFollowUp(summary.followUp)
    }
  }, [appointment])

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setError("")
      setSuccess(false)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle closing with animation
  const handleClose = () => {
    const backdrop = document.getElementById("add-summary-backdrop")
    const modalContent = document.getElementById("add-summary-content")

    if (backdrop) backdrop.style.animation = "fadeOut 0.3s ease-in-out forwards"
    if (modalContent) modalContent.style.animation = "scaleOut 0.3s ease-in-out forwards"

    setTimeout(() => {
      onClose()
    }, 280)
  }

  // Add prescription field
  const addPrescription = () => {
    setPrescriptions([...prescriptions, ""])
  }

  // Remove prescription field
  const removePrescription = (index) => {
    const newPrescriptions = [...prescriptions]
    newPrescriptions.splice(index, 1)
    if (newPrescriptions.length === 0) {
      newPrescriptions.push("")
    }
    setPrescriptions(newPrescriptions)
  }

  // Update prescription at index
  const updatePrescription = (index, value) => {
    const newPrescriptions = [...prescriptions]
    newPrescriptions[index] = value
    setPrescriptions(newPrescriptions)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!appointment || !appointment.id) {
      setError("Appointment information is missing")
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      // Filter out empty prescriptions
      const filteredPrescriptions = prescriptions.filter((p) => p.trim() !== "")

      // Create summary data
      const summaryData = {
        diagnosis: diagnosis.trim(),
        recommendations: recommendations.trim(),
        prescriptions: filteredPrescriptions,
        followUp: followUp.trim(),
        updatedAt: new Date().toISOString(),
      }

      // Update appointment with summary
      await updateAppointmentSummary(appointment.id, summaryData)

      setSuccess(true)

      // Notify parent component
      if (onSummaryAdded) {
        onSummaryAdded({
          ...appointment,
          summary: summaryData,
        })
      }

      // Close modal after a delay
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (error) {
      console.error("Error adding summary:", error)
      setError(error.message || "Failed to add summary")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen && !isVisible) return null
  if (!appointment) return null

  return (
    <>
      {/* Backdrop with animation */}
      <div
        id="add-summary-backdrop"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.3s ease-in-out" }}
      />

      {/* Modal with animation */}
      <div
        id="add-summary-content"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
        style={{ animation: "scaleIn 0.3s ease-in-out", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-graphite">Add Appointment Summary</h3>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber transition-colors duration-200"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">Summary added successfully!</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-graphite mb-1">
              Diagnosis
            </label>
            <textarea
              id="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              rows={2}
              placeholder="Enter diagnosis"
            />
          </div>

          <div>
            <label htmlFor="recommendations" className="block text-sm font-medium text-graphite mb-1">
              Recommendations
            </label>
            <textarea
              id="recommendations"
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              rows={3}
              placeholder="Enter recommendations"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-graphite">Prescriptions</label>
              <button
                type="button"
                onClick={addPrescription}
                className="inline-flex items-center text-xs text-soft-amber hover:text-amber-600"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </button>
            </div>

            {prescriptions.map((prescription, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={prescription}
                  onChange={(e) => updatePrescription(index, e.target.value)}
                  className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  placeholder={`Prescription ${index + 1}`}
                />
                {prescriptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrescription(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="followUp" className="block text-sm font-medium text-graphite mb-1">
              Follow-up
            </label>
            <input
              id="followUp"
              type="text"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              placeholder="e.g., Recommended in 6 months"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors duration-200 hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Summary"}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
