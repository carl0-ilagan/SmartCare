"use client"

import { useState } from "react"
import { Calendar, ChevronDown, ChevronUp, Clock, Filter, Plus, Search, User, X } from "lucide-react"
import { AppointmentModal } from "@/components/appointment-modal"
import { AppointmentDetailsModal } from "@/components/appointment-details-modal"
import { CancelAppointmentModal } from "@/components/cancel-appointment-modal"
import { AppointmentSummaryModal } from "@/components/appointment-summary-modal"
import { RescheduleModal } from "@/components/reschedule-modal"
import { SuccessNotification } from "@/components/success-notification"
import { AppointmentApprovalModal } from "@/components/appointment-approval-modal"

export default function DoctorAppointmentsPage() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPatient, setFilterPatient] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Modal states
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)

  // Notification state
  const [notification, setNotification] = useState({ message: "", isVisible: false })

  // Mock patients data
  const patients = [
    { id: 1, name: "John Smith", age: 45 },
    { id: 2, name: "Emily Johnson", age: 32 },
    { id: 3, name: "Michael Brown", age: 58 },
    { id: 4, name: "Sarah Davis", age: 27 },
    { id: 5, name: "Robert Wilson", age: 62 },
  ]

  // Mock appointments data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientId: 1,
      patient: "John Smith",
      date: "2023-06-15",
      time: "10:00 AM",
      type: "Follow-up",
      status: "pending",
      notes: "Blood pressure check",
    },
    {
      id: 2,
      patientId: 1,
      patient: "John Smith",
      date: "2023-05-10",
      time: "11:15 AM",
      type: "Initial Visit",
      status: "completed",
      notes: "Annual physical",
      summary: {
        diagnosis: "Hypertension, well-controlled",
        recommendations: "Continue current medication, reduce sodium intake",
        prescriptions: ["Lisinopril 10mg daily"],
        followUp: "3 months",
      },
    },
    {
      id: 3,
      patientId: 2,
      patient: "Emily Johnson",
      date: "2023-06-20",
      time: "2:30 PM",
      type: "Consultation",
      status: "approved",
      notes: "Discuss MRI results",
    },
    {
      id: 4,
      patientId: 3,
      patient: "Michael Brown",
      date: "2023-06-18",
      time: "9:00 AM",
      type: "Follow-up",
      status: "pending",
      notes: "Diabetes management",
    },
    {
      id: 5,
      patientId: 4,
      patient: "Sarah Davis",
      date: "2023-06-01",
      time: "3:30 PM",
      type: "Prenatal Check",
      status: "completed",
      notes: "20-week ultrasound",
      summary: {
        diagnosis: "Normal pregnancy progression",
        recommendations: "Continue prenatal vitamins, moderate exercise",
        prescriptions: ["Prenatal vitamins daily"],
        followUp: "4 weeks",
      },
    },
    {
      id: 6,
      patientId: 5,
      patient: "Robert Wilson",
      date: "2023-06-25",
      time: "11:00 AM",
      type: "Follow-up",
      status: "approved",
      notes: "Post-procedure check",
    },
    {
      id: 7,
      patientId: 2,
      patient: "Emily Johnson",
      date: "2023-05-15",
      time: "1:45 PM",
      type: "Consultation",
      status: "cancelled",
      notes: "Headache assessment",
    },
  ])

  // Filter appointments
  const filteredAppointments = appointments
    .filter((appointment) => {
      // Filter by search term
      const matchesSearch =
        appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.notes.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by status
      const matchesStatus = filterStatus === "all" || appointment.status === filterStatus

      // Filter by patient
      const matchesPatient = filterPatient === "all" || appointment.patientId.toString() === filterPatient

      return matchesSearch && matchesStatus && matchesPatient
    })
    .sort((a, b) => {
      // Sort by date (most recent first for completed, soonest first for upcoming)
      const dateA = new Date(a.date + "T" + a.time)
      const dateB = new Date(b.date + "T" + b.time)

      // Pending appointments first
      if (a.status === "pending" && b.status !== "pending") return -1
      if (a.status !== "pending" && b.status === "pending") return 1

      // Then approved appointments
      if (a.status === "approved" && b.status !== "approved" && b.status !== "pending") return -1
      if (a.status !== "approved" && a.status !== "pending" && b.status === "approved") return 1

      // Then by date
      if ((a.status === "pending" || a.status === "approved") && (b.status === "pending" || b.status === "approved")) {
        return dateA - dateB
      } else if (a.status === "completed" && b.status === "completed") {
        return dateB - dateA
      } else {
        return dateB - dateA
      }
    })

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
  const confirmCancelAppointment = (appointment, reason) => {
    // Update the appointment status
    const updatedAppointments = appointments.map((a) =>
      a.id === appointment.id ? { ...a, status: "cancelled", cancellationReason: reason } : a,
    )
    setAppointments(updatedAppointments)

    // Close the cancel modal
    setIsCancelModalOpen(false)

    // Show success notification
    setNotification({
      message: "Appointment cancelled successfully",
      isVisible: true,
    })
  }

  // Handle appointment approval
  const handleApproveAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setIsApprovalModalOpen(true)
  }

  // Confirm approval
  const confirmApproveAppointment = (appointment, doctorNote) => {
    // Update the appointment status
    const updatedAppointments = appointments.map((a) =>
      a.id === appointment.id ? { ...a, status: "approved", doctorNote } : a,
    )
    setAppointments(updatedAppointments)

    // Close the approval modal
    setIsApprovalModalOpen(false)

    // Show success notification
    setNotification({
      message: "Appointment approved successfully",
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
      status: "pending",
      patientId: Number.parseInt(newAppointment.patient),
      patient: patients.find((p) => p.id.toString() === newAppointment.patient)?.name || "Unknown Patient",
    }
    setAppointments([...appointments, appointmentWithId])

    // Close the appointment modal
    setIsAppointmentModalOpen(false)

    // Show success notification
    setNotification({
      message: "Appointment scheduled successfully",
      isVisible: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite md:text-3xl">Appointments</h1>
        <button
          onClick={() => setIsAppointmentModalOpen(true)}
          className="inline-flex items-center rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </button>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
          <input
            type="text"
            placeholder="Search by patient, type, or notes..."
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label htmlFor="filterPatient" className="block text-sm font-medium text-graphite">
                Patient
              </label>
              <select
                id="filterPatient"
                value={filterPatient}
                onChange={(e) => setFilterPatient(e.target.value)}
                className="mt-1 rounded-md border border-earth-beige bg-white py-1 pl-3 pr-10 text-sm text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              >
                <option value="all">All Patients</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id.toString()}>
                    {patient.name}
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
            {/* Pending Appointments */}
            {filteredAppointments.some((a) => a.status === "pending") && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-graphite">Pending Appointments</h2>
                {filteredAppointments
                  .filter((a) => a.status === "pending")
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-lg border-l-4 border-l-amber-400 border border-pale-stone bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center">
                            <User className="mr-2 h-5 w-5 text-soft-amber" />
                            <h3 className="font-medium text-graphite">{appointment.patient}</h3>
                            <span className="ml-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                              Pending
                            </span>
                          </div>
                          <p className="text-sm text-drift-gray">{appointment.type}</p>
                          {appointment.notes && <p className="text-sm text-drift-gray">Notes: {appointment.notes}</p>}
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
                        </div>
                      </div>
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
                          Decline
                        </button>
                        <button
                          onClick={() => handleApproveAppointment(appointment)}
                          className="rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-600 transition-colors hover:bg-green-200"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Approved Appointments */}
            {filteredAppointments.some((a) => a.status === "approved") && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-graphite">Approved Appointments</h2>
                {filteredAppointments
                  .filter((a) => a.status === "approved")
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-lg border-l-4 border-l-green-400 border border-pale-stone bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center">
                            <User className="mr-2 h-5 w-5 text-soft-amber" />
                            <h3 className="font-medium text-graphite">{appointment.patient}</h3>
                            <span className="ml-2 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Approved
                            </span>
                          </div>
                          <p className="text-sm text-drift-gray">{appointment.type}</p>
                          {appointment.notes && <p className="text-sm text-drift-gray">Notes: {appointment.notes}</p>}
                          {appointment.doctorNote && (
                            <p className="mt-1 text-sm font-medium text-graphite">
                              Your note: <span className="font-normal text-drift-gray">{appointment.doctorNote}</span>
                            </p>
                          )}
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
                        </div>
                      </div>
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
                            <h3 className="font-medium text-graphite">{appointment.patient}</h3>
                          </div>
                          <p className="text-sm text-drift-gray">{appointment.type}</p>
                          {appointment.notes && <p className="text-sm text-drift-gray">Notes: {appointment.notes}</p>}
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
                      className="rounded-lg border-l-4 border-l-red-400 border border-pale-stone bg-white p-4 shadow-sm opacity-70"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center">
                            <User className="mr-2 h-5 w-5 text-drift-gray" />
                            <h3 className="font-medium text-graphite">{appointment.patient}</h3>
                            <span className="ml-2 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              Cancelled
                            </span>
                          </div>
                          <p className="text-sm text-drift-gray">{appointment.type}</p>
                          {appointment.notes && <p className="text-sm text-drift-gray">Notes: {appointment.notes}</p>}
                          {appointment.cancellationReason && (
                            <p className="mt-1 text-sm font-medium text-red-600">
                              Reason: <span className="font-normal">{appointment.cancellationReason}</span>
                            </p>
                          )}
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
              {searchTerm || filterStatus !== "all" || filterPatient !== "all"
                ? "No appointments match your search criteria. Try adjusting your filters."
                : "You don't have any appointments scheduled. Schedule your first appointment now."}
            </p>
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
            >
              Schedule Appointment
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        userRole="doctor"
        onBook={handleBookAppointment}
        patients={patients}
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

      <AppointmentApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        appointment={selectedAppointment}
        onApprove={confirmApproveAppointment}
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
