"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, X, AlertCircle, FileText, User } from "lucide-react"

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

export function AppointmentModal({
  isOpen,
  onClose,
  userRole = "patient",
  onBook,
  appointmentToReschedule = null,
  patients = [],
}) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [reason, setReason] = useState("")
  const [doctor, setDoctor] = useState("")
  const [patient, setPatient] = useState("")
  const [type, setType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [unavailableDates, setUnavailableDates] = useState([])
  const [selectedDoctorBookings, setSelectedDoctorBookings] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [doctorUnavailableDates, setDoctorUnavailableDates] = useState([])

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)

      // Load doctor unavailable dates
      const savedDates = localStorage.getItem("doctorUnavailableDates")
      if (savedDates) {
        setDoctorUnavailableDates(JSON.parse(savedDates))
      }
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
      setReason("")
      setDoctor("")
      setPatient("")
      setType("")
      setAvailableTimeSlots(allTimeSlots)
    }
  }, [isOpen])

  // Update available time slots when date or doctor changes
  useEffect(() => {
    if (date && doctor) {
      // Find bookings for the selected doctor and date
      const doctorId = Number.parseInt(doctor)
      const bookingsForDate = doctorBookings.filter((booking) => booking.doctorId === doctorId && booking.date === date)

      setSelectedDoctorBookings(bookingsForDate)

      // Filter out booked time slots
      const bookedTimes = bookingsForDate.map((booking) => booking.time)
      const available = allTimeSlots.filter((slot) => !bookedTimes.includes(slot))

      setAvailableTimeSlots(available)
    } else {
      setAvailableTimeSlots(allTimeSlots)
    }
  }, [date, doctor])

  // Update unavailable dates when doctor changes
  useEffect(() => {
    if (doctor) {
      const doctorId = Number.parseInt(doctor)

      // Find dates where the doctor has no available slots
      const fullyBookedDates = []

      // Get all unique dates for this doctor
      const doctorDates = [
        ...new Set(doctorBookings.filter((booking) => booking.doctorId === doctorId).map((booking) => booking.date)),
      ]

      // Check each date if all slots are booked
      doctorDates.forEach((bookingDate) => {
        const bookingsForDate = doctorBookings.filter(
          (booking) => booking.doctorId === doctorId && booking.date === bookingDate,
        )

        if (bookingsForDate.length >= allTimeSlots.length) {
          fullyBookedDates.push(bookingDate)
        }
      })

      // Add doctor's unavailable dates
      const doctorUnavailable = doctorUnavailableDates.map((d) => d.date)

      setUnavailableDates([...fullyBookedDates, ...doctorUnavailable])
    } else {
      // If no doctor selected, just use the doctor unavailable dates
      setUnavailableDates(doctorUnavailableDates.map((d) => d.date))
    }
  }, [doctor, doctorUnavailableDates])

  if (!isOpen && !isVisible) return null

  const isRescheduling = !!appointmentToReschedule

  // Get tomorrow's date for min date attribute
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create appointment object
    const appointmentData =
      userRole === "patient"
        ? {
            doctor: doctors.find((d) => d.id.toString() === doctor)?.name || "",
            specialty: doctors.find((d) => d.id.toString() === doctor)?.specialty || "",
            date,
            time,
            type: type || "Consultation",
            notes: reason,
          }
        : {
            patient,
            date,
            time,
            type: type || "Consultation",
            notes: reason,
          }

    // Simulate API call
    setTimeout(() => {
      if (onBook) {
        onBook(appointmentData)
      }

      setIsSubmitting(false)
      onClose()
    }, 1000)
  }

  // Handle closing with animation
  const handleClose = () => {
    if (isSubmitting) return

    const backdrop = document.getElementById("modal-backdrop")
    const modalContent = document.getElementById("modal-content")

    if (backdrop) backdrop.style.animation = "fadeOut 0.3s ease-in-out forwards"
    if (modalContent) modalContent.style.animation = "scaleOut 0.3s ease-in-out forwards"

    setTimeout(() => {
      onClose()
    }, 280)
  }

  // Check if a date is unavailable (fully booked or doctor unavailable)
  const isDateUnavailable = (dateString) => {
    return unavailableDates.includes(dateString)
  }

  // Mock data
  const doctors = [
    { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist" },
    { id: 2, name: "Dr. Michael Chen", specialty: "Dermatologist" },
    { id: 3, name: "Dr. Emily Rodriguez", specialty: "Neurologist" },
    { id: 4, name: "Dr. David Kim", specialty: "Pediatrician" },
  ]

  // Appointment types
  const appointmentTypes = [
    "Initial Visit",
    "Follow-up",
    "Consultation",
    "Annual Physical",
    "Urgent Care",
    "Specialist Referral",
  ]

  // Mock doctor bookings data
  const doctorBookings = [
    { doctorId: 1, date: "2023-06-15", time: "10:00 AM" },
    { doctorId: 1, date: "2023-06-15", time: "11:00 AM" },
    { doctorId: 1, date: "2023-06-16", time: "9:00 AM" },
    { doctorId: 1, date: "2023-06-16", time: "9:30 AM" },
    { doctorId: 1, date: "2023-06-16", time: "10:00 AM" },
    { doctorId: 1, date: "2023-06-16", time: "10:30 AM" },
    { doctorId: 1, date: "2023-06-16", time: "11:00 AM" },
    { doctorId: 1, date: "2023-06-16", time: "11:30 AM" },
    { doctorId: 1, date: "2023-06-16", time: "1:00 PM" },
    { doctorId: 1, date: "2023-06-16", time: "1:30 PM" },
    { doctorId: 1, date: "2023-06-16", time: "2:00 PM" },
    { doctorId: 1, date: "2023-06-16", time: "2:30 PM" },
    { doctorId: 1, date: "2023-06-16", time: "3:00 PM" },
    { doctorId: 1, date: "2023-06-16", time: "3:30 PM" },
    { doctorId: 1, date: "2023-06-16", time: "4:00 PM" },
    { doctorId: 1, date: "2023-06-16", time: "4:30 PM" },
    { doctorId: 2, date: "2023-06-15", time: "2:30 PM" },
    { doctorId: 3, date: "2023-06-17", time: "11:15 AM" },
  ]

  return (
    <>
      {/* Backdrop with animation */}
      <div
        id="modal-backdrop"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.3s ease-in-out" }}
      />

      {/* Modal with animation */}
      <div
        id="modal-content"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
        style={{ animation: "scaleIn 0.3s ease-in-out" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-graphite">
            {isRescheduling
              ? "Reschedule Appointment"
              : userRole === "patient"
                ? "Book an Appointment"
                : "Schedule an Appointment"}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber transition-colors duration-200"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {userRole === "patient" && (
            <div className="space-y-2">
              <label htmlFor="doctor" className="text-sm font-medium text-graphite">
                Select Doctor
              </label>
              <select
                id="doctor"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                required
                className="w-full rounded-md border border-earth-beige bg-white py-2 pl-3 pr-10 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber transition-colors duration-200"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {doc.specialty}
                  </option>
                ))}
              </select>
            </div>
          )}

          {userRole === "doctor" && (
            <div className="space-y-2">
              <label htmlFor="patient" className="text-sm font-medium text-graphite">
                Select Patient
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                <select
                  id="patient"
                  value={patient}
                  onChange={(e) => setPatient(e.target.value)}
                  required
                  className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber transition-colors duration-200"
                >
                  <option value="">Select a patient</option>
                  {patients.map((pat) => (
                    <option key={pat.id} value={pat.id}>
                      {pat.name} - Age: {pat.age}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium text-graphite">
              Date
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
                This date is unavailable for appointments.
              </div>
            )}

            {unavailableDates.length > 0 && (
              <div className="mt-1 text-xs text-drift-gray">
                <span className="font-medium">Unavailable dates:</span>{" "}
                {unavailableDates.slice(0, 3).map((d, i) => (
                  <span key={d}>
                    {new Date(d).toLocaleDateString()}
                    {i < Math.min(unavailableDates.length - 1, 2) ? ", " : ""}
                  </span>
                ))}
                {unavailableDates.length > 3 && ` and ${unavailableDates.length - 3} more...`}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium text-graphite">
              Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
              <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                disabled={availableTimeSlots.length === 0 || isDateUnavailable(date)}
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

            {date && selectedDoctorBookings.length > 0 && (
              <div className="mt-1 text-xs text-drift-gray">
                <span className="font-medium">Booked times:</span>{" "}
                {selectedDoctorBookings.map((booking, i) => (
                  <span key={i}>
                    {booking.time}
                    {i < selectedDoctorBookings.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium text-graphite">
              Appointment Type
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber transition-colors duration-200"
              >
                <option value="">Select appointment type</option>
                {appointmentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium text-graphite">
              Reason for Visit
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe the reason for the visit"
              required
              rows={3}
              className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber transition-colors duration-200"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors duration-200 hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || availableTimeSlots.length === 0 || isDateUnavailable(date)}
              className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-soft-amber/90 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting
                ? isRescheduling
                  ? "Rescheduling..."
                  : "Scheduling..."
                : isRescheduling
                  ? "Reschedule"
                  : "Schedule Appointment"}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
