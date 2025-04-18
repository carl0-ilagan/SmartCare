"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, X, AlertCircle } from "lucide-react"

// All possible time slots
const allTimeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
]

// Mock doctor bookings data
const doctorBookings = [
  { doctor: "Dr. Sarah Johnson", date: "2023-06-15", time: "10:00 AM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-15", time: "11:00 AM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "9:00 AM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "9:30 AM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "10:00 AM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "10:30 AM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "11:00 AM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "11:30 AM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "1:00 PM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "1:30 PM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "2:00 PM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "2:30 PM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "3:00 PM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "3:30 PM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "4:00 PM" },
  { doctor: "Dr. Sarah Johnson", date: "2023-06-16", time: "4:30 PM" },
  { doctor: "Dr. Michael Chen", date: "2023-06-15", time: "2:30 PM" },
  { doctor: "Dr. Emily Rodriguez", date: "2023-06-17", time: "11:15 AM" },
]

export function RescheduleModal({ isOpen, onClose, appointment, onReschedule }) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [unavailableDates, setUnavailableDates] = useState([])
  const [selectedDateBookings, setSelectedDateBookings] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  // Fix the modal visibility and animation
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setDate("")
      setTime("")
      setAvailableTimeSlots(allTimeSlots)
    }
  }, [isOpen])

  // Update available time slots when date changes
  useEffect(() => {
    if (date && appointment) {
      // Find doctor from the appointment
      const doctorName = appointment.doctor

      // Find bookings for the selected doctor and date
      const bookingsForDate = doctorBookings.filter((booking) => booking.doctor === doctorName && booking.date === date)

      setSelectedDateBookings(bookingsForDate)

      // Filter out booked time slots
      const bookedTimes = bookingsForDate.map((booking) => booking.time)
      const available = allTimeSlots.filter((slot) => !bookedTimes.includes(slot))

      setAvailableTimeSlots(available)
    } else {
      setAvailableTimeSlots(allTimeSlots)
    }
  }, [date, appointment])

  // Update unavailable dates when appointment changes
  useEffect(() => {
    if (appointment) {
      const doctorName = appointment.doctor

      // Find dates where the doctor has no available slots
      const fullyBookedDates = []

      // Get all unique dates for this doctor
      const doctorDates = [
        ...new Set(doctorBookings.filter((booking) => booking.doctor === doctorName).map((booking) => booking.date)),
      ]

      // Check each date if all slots are booked
      doctorDates.forEach((bookingDate) => {
        const bookingsForDate = doctorBookings.filter(
          (booking) => booking.doctor === doctorName && booking.date === bookingDate,
        )

        if (bookingsForDate.length >= allTimeSlots.length) {
          fullyBookedDates.push(bookingDate)
        }
      })

      setUnavailableDates(fullyBookedDates)
    } else {
      setUnavailableDates([])
    }
  }, [appointment])

  // Ensure the modal properly renders when open
  if (!isOpen && !isVisible) return null

  // Get tomorrow's date for min date attribute
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  // Fix the form submission to properly call onReschedule
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onReschedule({
        ...appointment,
        date,
        time,
        status: "upcoming",
      })
      setIsSubmitting(false)
      onClose()
    }, 1000)
  }

  // Fix the modal closing behavior
  const handleClose = () => {
    if (isSubmitting) return

    const backdrop = document.getElementById("reschedule-backdrop")
    const modalContent = document.getElementById("reschedule-content")

    if (backdrop) backdrop.style.animation = "fadeOut 0.3s ease-in-out forwards"
    if (modalContent) modalContent.style.animation = "scaleOut 0.3s ease-in-out forwards"

    setTimeout(() => {
      onClose()
    }, 280)
  }

  // Check if a date is unavailable (fully booked)
  const isDateUnavailable = (dateString) => {
    return unavailableDates.includes(dateString)
  }

  return (
    <>
      {/* Backdrop with animation */}
      <div
        id="reschedule-backdrop"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.3s ease-in-out" }}
      />

      {/* Modal with animation */}
      <div
        id="reschedule-content"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
        style={{ animation: "scaleIn 0.3s ease-in-out" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-graphite">Reschedule Appointment</h2>
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
            Reschedule appointment with <span className="font-medium text-graphite">{appointment?.patient}</span>
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium text-graphite">
                New Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                <input
                  id="date"
                  type="date"
                  min={minDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber transition-colors duration-200"
                />
              </div>

              {date && isDateUnavailable(date) && (
                <div className="mt-1 flex items-center text-xs text-red-500">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  This date is fully booked for {appointment?.doctor}.
                </div>
              )}

              {unavailableDates.length > 0 && (
                <div className="mt-1 text-xs text-drift-gray">
                  <span className="font-medium">Unavailable dates:</span>{" "}
                  {unavailableDates.map((d, i) => (
                    <span key={d}>
                      {new Date(d).toLocaleDateString()}
                      {i < unavailableDates.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium text-graphite">
                New Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                <select
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  disabled={availableTimeSlots.length === 0}
                  className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber disabled:bg-pale-stone disabled:text-drift-gray transition-colors duration-200"
                >
                  <option value="">Select a time</option>
                  {availableTimeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {date && selectedDateBookings.length > 0 && (
                <div className="mt-1 text-xs text-drift-gray">
                  <span className="font-medium">Booked times:</span>{" "}
                  {selectedDateBookings.map((booking, i) => (
                    <span key={i}>
                      {booking.time}
                      {i < selectedDateBookings.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors duration-200 hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !date || !time || isDateUnavailable(date)}
                className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2 disabled:opacity-70"
              >
                {isSubmitting ? "Rescheduling..." : "Reschedule"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
