"use client"

import { useState, useEffect } from "react"
import { Calendar, X, Plus, Trash2 } from "lucide-react"
import { AvailabilitySuccessModal } from "@/components/availability-success-modal"

export function DoctorAvailabilityModal({ isOpen, onClose, onSave }) {
  const [isVisible, setIsVisible] = useState(false)
  const [unavailableDates, setUnavailableDates] = useState([])
  const [newDate, setNewDate] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Load saved unavailable dates (mock data for now)
      const savedDates = localStorage.getItem("doctorUnavailableDates")
      if (savedDates) {
        setUnavailableDates(JSON.parse(savedDates))
      }
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle closing with animation
  const handleClose = () => {
    if (isSubmitting) return

    const backdrop = document.getElementById("availability-backdrop")
    const modalContent = document.getElementById("availability-content")

    if (backdrop) backdrop.style.animation = "fadeOut 0.3s ease-in-out forwards"
    if (modalContent) modalContent.style.animation = "scaleOut 0.3s ease-in-out forwards"

    setTimeout(() => {
      onClose()
    }, 280)
  }

  const addUnavailableDate = (e) => {
    e.preventDefault()

    if (!newDate || !reason) return

    const dateExists = unavailableDates.some((date) => date.date === newDate)

    if (dateExists) {
      alert("This date is already marked as unavailable")
      return
    }

    const updatedDates = [
      ...unavailableDates,
      {
        id: Date.now(),
        date: newDate,
        reason: reason,
      },
    ]

    setUnavailableDates(updatedDates)
    setNewDate("")
    setReason("")
  }

  const removeUnavailableDate = (id) => {
    const updatedDates = unavailableDates.filter((date) => date.id !== id)
    setUnavailableDates(updatedDates)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Save to localStorage (in a real app, this would be an API call)
    localStorage.setItem("doctorUnavailableDates", JSON.stringify(unavailableDates))

    // Call the onSave function with the updated dates
    if (onSave) {
      onSave(unavailableDates)
    }

    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccessModal(true)
    }, 500)
  }

  if (!isOpen && !isVisible) return null

  // Get today's date for min date attribute
  const today = new Date()
  const minDate = today.toISOString().split("T")[0]

  return (
    <>
      {/* Backdrop with animation */}
      <div
        id="availability-backdrop"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.3s ease-in-out" }}
      />

      {/* Modal with animation */}
      <div
        id="availability-content"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
        style={{ animation: "scaleIn 0.3s ease-in-out" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-graphite">Manage Availability</h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber transition-colors duration-200"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="mt-4">
          <form onSubmit={addUnavailableDate} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="newDate" className="text-sm font-medium text-graphite">
                Mark Date as Unavailable
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                <input
                  id="newDate"
                  type="date"
                  min={minDate}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber transition-colors duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium text-graphite">
                Reason (Private)
              </label>
              <input
                id="reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Meeting, Conference, Personal, etc."
                required
                className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber transition-colors duration-200"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-soft-amber px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Date
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-md font-medium text-graphite">Unavailable Dates</h3>

            {unavailableDates.length === 0 ? (
              <p className="mt-2 text-sm text-drift-gray">No dates marked as unavailable</p>
            ) : (
              <div className="mt-2 max-h-60 overflow-y-auto space-y-2">
                {unavailableDates.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-md border border-pale-stone p-3"
                  >
                    <div>
                      <p className="font-medium text-graphite">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-drift-gray">{item.reason}</p>
                    </div>
                    <button
                      onClick={() => removeUnavailableDate(item.id)}
                      className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors duration-200 hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      {showSuccessModal && (
        <AvailabilitySuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false)
            handleClose()
          }}
          message="Your availability has been updated successfully!"
        />
      )}
    </>
  )
}
