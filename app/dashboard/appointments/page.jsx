"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, ChevronDown, ChevronUp, Clock, Filter, Plus, Search, User, X } from "lucide-react"
import { AppointmentModal } from "@/components/appointment-modal"
import { AppointmentDetailsModal } from "@/components/appointment-details-modal"
import { CancelAppointmentModal } from "@/components/cancel-appointment-modal"
import { AppointmentSummaryModal } from "@/components/appointment-summary-modal"
import { RescheduleModal } from "@/components/reschedule-modal"
import { SuccessNotification } from "@/components/success-notification"

export default function AppointmentsPage() {
  const router = useRouter()
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Modal states
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)

  // Notification state
  const [notification, setNotification] = useState({ message: "", isVisible: false })

  // Mock appointments data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2023-06-15",
      time: "10:00 AM",
      type: "Follow-up",
      status: "upcoming",
      notes: "Bring recent test results",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "2023-06-20",
      time: "2:30 PM",
      type: "Consultation",
      status: "upcoming",
      notes: "Discuss treatment options",
    },
    {
      id: 3,
      doctor: "Dr. Emily Rodriguez",
      specialty: "Neurologist",
      date: "2023-05-10",
      time: "11:15 AM",
      type: "Initial Visit",
      status: "completed",
      notes: "Headache assessment",
    },
    {
      id: 4,
      doctor: "Dr. David Kim",
      specialty: "Pediatrician",
      date: "2023-05-05",
      time: "9:30 AM",
      type: "Check-up",
      status: "completed",
      notes: "Annual physical",
    },
    {
      id: 5,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2023-04-20",
      time: "3:45 PM",
      type: "Follow-up",
      status: "completed",
      notes: "Blood pressure monitoring",
    },
    {
      id: 6,
      doctor: "Dr. Lisa Patel",
      specialty: "Psychiatrist",
      date: "2023-06-25",
      time: "1:00 PM",
      type: "Therapy",
      status: "upcoming",
      notes: "Anxiety management",
    },
    {
      id: 7,
      doctor: "Dr. James Wilson",
      specialty: "Orthopedist",
      date: "2023-05-15",
      time: "10:30 AM",
      type: "Follow-up",
      status: "cancelled",
      notes: "Post-surgery check",
    },
  ])

  // Filter appointments
  const filteredAppointments = appointments
    .filter((appointment) => {
      // Filter by search term
      const matchesSearch =
        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by status
      const matchesStatus = filterStatus === "all" || appointment.status === filterStatus

      // Filter by type
      const matchesType = filterType === "all" || appointment.type === filterType

      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      // Sort by date (most recent first for completed, soonest first for upcoming)
      const dateA = new Date(a.date + "T" + a.time)
      const dateB = new Date(b.date + "T" + b.time)

      if (a.status === "upcoming" && b.status === "upcoming") {
        return dateA - dateB
      } else if (a.status === "completed" && b.status === "completed") {
        return dateB - dateA
      } else if (a.status === "upcoming") {
        return -1
      } else if (b.status === "upcoming") {
        return 1
      } else {
        return dateB - dateA
      }
    })

  // Get unique appointment types for filter
  const appointmentTypes = [...new Set(appointments.map((a) => a.type))]

  // Handle appointment details
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment)
    setIsDetailsModalOpen(true)
  }

  // Handle appointment cancellation
  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setIsCancelModalOpen(true)
  }

  // Confirm cancellation
  const confirmCancelAppointment = (appointment) => {
    // Update the appointment status
    const updatedAppointments = appointments.map((a) => (a.id === appointment.id ? { ...a, status: "cancelled" } : a))
    setAppointments(updatedAppointments)

    // Close the cancel modal
    setIsCancelModalOpen(false)

    // Show success notification
    setNotification({
      message: "Appointment cancelled successfully",
      isVisible: true,
    })
  }

  // Handle view summary
  const handleViewSummary = (appointment) => {
    setSelectedAppointment(appointment)
    setIsSummaryModalOpen(true)
  }

  // Handle reschedule
  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment)
    setIsRescheduleModalOpen(true)
  }

  // Confirm reschedule
  const confirmReschedule = (updatedAppointment) => {
    // Update the appointment
    const updatedAppointments = appointments.map((a) => (a.id === updatedAppointment.id ? updatedAppointment : a))
    setAppointments(updatedAppointments)

    // Close the reschedule modal
    setIsRescheduleModalOpen(false)

    // Show success notification
    setNotification({
      message: "Appointment rescheduled successfully",
      isVisible: true,
    })
  }

  // Handle booking a new appointment
  const handleBookAppointment = (newAppointment) => {
    // Add the new appointment to the list
    const appointmentWithId = {
      ...newAppointment,
      id: appointments.length + 1,
      status: "upcoming",
    }
    setAppointments([...appointments, appointmentWithId])

    // Close the appointment modal
    setIsAppointmentModalOpen(false)

    // Show success notification
    setNotification({
      message: "Appointment booked successfully",
      isVisible: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite md:text-3xl">My Appointments</h1>
        <button
          onClick={() => setIsAppointmentModalOpen(true)}
          className="inline-flex items-center rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Book Appointment
        </button>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
          <input
            type="text"
            placeholder="Search by doctor or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite shadow-sm transition-colors hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </button>
      </div>

      {showFilters && (
        <div className="rounded-lg border border-earth-beige bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-graphite">
                Status
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mt-1 rounded-md border border-earth-beige bg-white py-1 pl-3 pr-10 text-sm text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              >
                <option value="all">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label htmlFor="filterType" className="block text-sm font-medium text-graphite">
                Type
              </label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="mt-1 rounded-md border border-earth-beige bg-white py-1 pl-3 pr-10 text-sm text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              >
                <option value="all">All Types</option>
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          <>
            {/* Upcoming Appointments */}
            {filteredAppointments.some((a) => a.status === "upcoming") && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-graphite">Upcoming Appointments</h2>
                {filteredAppointments
                  .filter((a) => a.status === "upcoming")
                  .map((appointment) => (
                    <div key={appointment.id} className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center">
                            <User className="mr-2 h-5 w-5 text-soft-amber" />
                            <h3 className="font-medium text-graphite">{appointment.doctor}</h3>
                          </div>
                          <p className="text-sm text-drift-gray">{appointment.specialty}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                            <Calendar className="mr-2 h-4 w-4 text-soft-amber" />
                            <span className="text-sm text-graphite">
                              {new Date(appointment.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                            <Clock className="mr-2 h-4 w-4 text-soft-amber" />
                            <span className="text-sm text-graphite">{appointment.time}</span>
                          </div>
                          <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                            <span className="text-sm text-graphite">{appointment.type}</span>
                          </div>
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="mt-3 rounded-md bg-pale-stone/50 p-2">
                          <p className="text-sm text-drift-gray">
                            <span className="font-medium">Notes:</span> {appointment.notes}
                          </p>
                        </div>
                      )}
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="rounded-md border border-earth-beige bg-white px-3 py-1 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(appointment)}
                          className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Past Appointments */}
            {filteredAppointments.some((a) => a.status === "completed") && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-graphite">Past Appointments</h2>
                {filteredAppointments
                  .filter((a) => a.status === "completed")
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm opacity-80"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center">
                            <User className="mr-2 h-5 w-5 text-drift-gray" />
                            <h3 className="font-medium text-graphite">{appointment.doctor}</h3>
                          </div>
                          <p className="text-sm text-drift-gray">{appointment.specialty}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                            <Calendar className="mr-2 h-4 w-4 text-drift-gray" />
                            <span className="text-sm text-graphite">
                              {new Date(appointment.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                            <Clock className="mr-2 h-4 w-4 text-drift-gray" />
                            <span className="text-sm text-graphite">{appointment.time}</span>
                          </div>
                          <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                            <span className="text-sm text-graphite">{appointment.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleViewSummary(appointment)}
                          className="rounded-md border border-earth-beige bg-white px-3 py-1 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone"
                        >
                          View Summary
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Cancelled Appointments */}
            {filteredAppointments.some((a) => a.status === "cancelled") && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-graphite">Cancelled Appointments</h2>
                {filteredAppointments
                  .filter((a) => a.status === "cancelled")
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm opacity-70"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center">
                            <User className="mr-2 h-5 w-5 text-drift-gray" />
                            <h3 className="font-medium text-graphite">{appointment.doctor}</h3>
                          </div>
                          <p className="text-sm text-drift-gray">{appointment.specialty}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                            <Calendar className="mr-2 h-4 w-4 text-drift-gray" />
                            <span className="text-sm text-graphite">
                              {new Date(appointment.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                            <Clock className="mr-2 h-4 w-4 text-drift-gray" />
                            <span className="text-sm text-graphite">{appointment.time}</span>
                          </div>
                          <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                            <X className="mr-2 h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-500">Cancelled</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleReschedule(appointment)}
                          className="rounded-md bg-soft-amber px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                        >
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-pale-stone bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pale-stone">
              <Calendar className="h-8 w-8 text-drift-gray" />
            </div>
            <h3 className="mb-1 text-lg font-medium text-graphite">No Appointments Found</h3>
            <p className="mb-4 text-drift-gray">
              {searchTerm || filterStatus !== "all" || filterType !== "all"
                ? "No appointments match your search criteria. Try adjusting your filters."
                : "You don't have any appointments scheduled. Book your first appointment now."}
            </p>
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
            >
              Book Appointment
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        userRole="patient"
        onBook={handleBookAppointment}
      />

      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        appointment={selectedAppointment}
        onCancel={handleCancelAppointment}
        onViewSummary={handleViewSummary}
      />

      <CancelAppointmentModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        appointment={selectedAppointment}
        onConfirm={confirmCancelAppointment}
      />

      <AppointmentSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        appointment={selectedAppointment}
      />

      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        appointment={selectedAppointment}
        onReschedule={confirmReschedule}
      />

      {/* Success Notification */}
      <SuccessNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </div>
  )
}
