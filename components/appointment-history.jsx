"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  CalendarDays,
  SlidersHorizontal,
  FileText,
} from "lucide-react"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { AppointmentDetailsModal } from "@/components/appointment-details-modal"
import { AppointmentSummaryModal } from "@/components/appointment-summary-modal"
import { hasSummary } from "@/lib/appointment-utils"
import PaginationControls from "@/components/pagination-controls"
import ProfileImage from "@/components/profile-image"

// Add doctorId and viewMode props to the component definition
export function AppointmentHistory({ userId, viewMode: initialViewMode = "patient", doctorId }) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [filterDate, setFilterDate] = useState("")
  const [error, setError] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  // Add view mode state (grid or list)
  const [viewMode, setViewMode] = useState("list")
  // Add appointmentsPerPage state
  const appointmentsPerPage = 5
  const [currentPage, setCurrentPage] = useState(1)

  // Load appointments
  // In the useEffect where appointments are loaded, update the query based on viewMode
  useEffect(() => {
    if (!userId) return

    try {
      setLoading(true)
      setError("")

      // Create the appropriate query based on viewMode
      let q
      if (initialViewMode === "doctor" && doctorId) {
        // For doctor view, get appointments where the doctor is the current user and patient is the userId
        q = query(
          collection(db, "appointments"),
          where("doctorId", "==", doctorId),
          where("patientId", "==", userId),
          orderBy("date", "desc"),
        )
      } else {
        // For patient view, get appointments where the patient is the userId
        q = query(collection(db, "appointments"), where("patientId", "==", userId), orderBy("date", "desc"))
      }

      // Rest of the code remains the same
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const appointmentsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          // Sort appointments by date (most recent first)
          const sortedAppointments = [...appointmentsData].sort(
            (a, b) => new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time),
          )
          setAppointments(sortedAppointments)
          setLoading(false)
        },
        (error) => {
          console.error("Error fetching appointments:", error)
          setError(error.message)
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } catch (error) {
      console.error("Error fetching appointments:", error)
      setError(error.message)
      setLoading(false)
    }
  }, [userId, initialViewMode, doctorId])

  // Filter appointments based on search, status, and date
  const filteredAppointments = appointments.filter((appointment) => {
    // Filter by search term
    const matchesSearch =
      appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.symptoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.location?.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by status
    const matchesStatus = filterStatus === "all" || appointment.status === filterStatus

    // Filter by date
    const matchesDate = !filterDate || appointment.date === filterDate

    return matchesSearch && matchesStatus && matchesDate
  })

  // Calculate pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / appointmentsPerPage))
  const displayedAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment)

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </span>
        )
      case "cancelled":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </span>
        )
      case "scheduled":
      case "approved":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <Calendar className="mr-1 h-3 w-3" />
            Scheduled
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pending
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>
        )
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date"

    try {
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setFilterStatus("all")
    setFilterDate("")
  }

  // Handle view details
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment)
    setShowSummaryModal(false)
  }

  // Handle view summary
  const handleViewSummary = (appointment) => {
    setSelectedAppointment(appointment)
    setShowSummaryModal(true)
  }

  // Handle cancel appointment
  const handleCancelAppointment = (appointment) => {
    // This would be implemented to handle cancellation
    console.log("Cancel appointment:", appointment.id)
  }

  // Update the useEffect to check for appointments that need to be marked as completed
  useEffect(() => {
    if (!appointments.length) return

    const checkAppointmentsStatus = async () => {
      // Mock function to simulate checking appointment status
      const batchCheckAppointmentStatus = async (appointments) => {
        return []
      }
      const updatedAppointments = await batchCheckAppointmentStatus(appointments)

      if (updatedAppointments.length > 0) {
        // Update the local state to reflect the changes
        setAppointments((prevAppointments) =>
          prevAppointments.map((apt) => {
            const updated = updatedAppointments.find((updated) => updated.id === apt.id)
            return updated || apt
          }),
        )
      }
    }

    // Run immediately on mount
    checkAppointmentsStatus()

    // Set up an interval to check every minute
    const intervalId = setInterval(checkAppointmentsStatus, 60000)

    return () => clearInterval(intervalId)
  }, [appointments])

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    // Scroll to top of appointments section
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterStatus, filterDate])

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="inline-flex items-center rounded-md border border-earth-beige bg-white px-3 py-2 text-sm font-medium text-graphite shadow-sm transition-colors hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
          >
            {viewMode === "grid" ? (
              <>
                <FileText className="mr-2 h-4 w-4" />
                List View
              </>
            ) : (
              <>
                <div className="mr-2 grid grid-cols-2 gap-0.5">
                  <div className="h-1.5 w-1.5 rounded-sm bg-graphite"></div>
                  <div className="h-1.5 w-1.5 rounded-sm bg-graphite"></div>
                  <div className="h-1.5 w-1.5 rounded-sm bg-graphite"></div>
                  <div className="h-1.5 w-1.5 rounded-sm bg-graphite"></div>
                </div>
                Grid View
              </>
            )}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center rounded-md border border-earth-beige bg-white px-3 py-2 text-sm font-medium text-graphite shadow-sm transition-colors hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {(filterStatus !== "all" || filterDate) && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-soft-amber text-xs text-white">
                {(filterStatus !== "all" ? 1 : 0) + (filterDate ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="rounded-lg border border-earth-beige bg-white p-4 shadow-sm animate-slideDown">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0">
            <div className="flex-1 space-y-2">
              <label htmlFor="filterStatus" className="text-sm font-medium text-graphite">
                Appointment Status
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="approved">Scheduled</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="flex-1 space-y-2">
              <label htmlFor="filterDate" className="text-sm font-medium text-graphite">
                Appointment Date
              </label>
              <input
                id="filterDate"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              />
            </div>

            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone w-full sm:w-auto"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber mb-4"></div>
            <p className="text-drift-gray">Loading your appointment history...</p>
          </div>
        </div>
      ) : filteredAppointments.length > 0 ? (
        viewMode === "grid" ? (
          // Grid view
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
            {displayedAppointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className="group overflow-hidden rounded-lg border border-pale-stone bg-white shadow-sm transition-all hover:shadow-md hover:border-soft-amber/30"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                  opacity: 0,
                }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="mr-3 flex-shrink-0">
                        {initialViewMode === "doctor" ? (
                          <ProfileImage
                            userId={appointment.patientId}
                            size="md"
                            fallback={appointment.patientName?.charAt(0) || "P"}
                            role="patient"
                          />
                        ) : (
                          <ProfileImage
                            userId={appointment.doctorId}
                            size="md"
                            fallback={appointment.doctorName?.charAt(0) || "D"}
                            role="doctor"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-graphite">
                          {initialViewMode === "doctor" ? appointment.patientName : appointment.doctorName}
                        </h3>
                        <p className="text-xs text-drift-gray">{appointment.type}</p>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center">
                      <Calendar className="mr-1.5 h-4 w-4 text-soft-amber flex-shrink-0" />
                      <span className="text-sm text-drift-gray truncate">{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1.5 h-4 w-4 text-soft-amber flex-shrink-0" />
                      <span className="text-sm text-drift-gray">{appointment.time || "Time not specified"}</span>
                    </div>
                    {appointment.doctorName && (
                      <div className="flex items-center">
                        <User className="mr-1.5 h-4 w-4 text-soft-amber flex-shrink-0" />
                        <span className="text-sm text-drift-gray truncate">Dr. {appointment.doctorName}</span>
                      </div>
                    )}
                    {appointment.location && (
                      <div className="flex items-center">
                        <MapPin className="mr-1.5 h-4 w-4 text-soft-amber flex-shrink-0" />
                        <span className="text-sm text-drift-gray truncate">{appointment.location}</span>
                      </div>
                    )}
                  </div>

                  {appointment.symptoms && (
                    <div className="border-t border-pale-stone pt-2 mb-3">
                      <p className="text-xs text-drift-gray line-clamp-2">
                        <span className="font-medium text-graphite">Symptoms: </span>
                        {appointment.symptoms}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end pt-2 border-t border-pale-stone">
                    {appointment.status === "completed" ? (
                      // For completed appointments, show the summary button if available
                      hasSummary(appointment) ? (
                        <button
                          onClick={() => handleViewSummary(appointment)}
                          className="inline-flex items-center rounded-md bg-soft-amber px-3 py-1.5 text-xs font-medium text-white hover:bg-soft-amber/90 transition-colors"
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          View Summary
                        </button>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-400 cursor-not-allowed"
                          title="Summary not available yet"
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          No Summary Available
                        </button>
                      )
                    ) : (
                      // For non-completed appointments, show the view details button
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        className="inline-flex items-center rounded-md bg-soft-amber/10 px-3 py-1.5 text-xs font-medium text-soft-amber hover:bg-soft-amber/20 transition-colors"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List view
          <div className="space-y-4">
            {displayedAppointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className="overflow-hidden rounded-lg border border-pale-stone bg-white shadow-sm transition-all hover:shadow-md"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                  opacity: 0,
                }}
              >
                <div className="p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center">
                        <div className="mr-3 flex-shrink-0">
                          {initialViewMode === "doctor" ? (
                            <ProfileImage
                              userId={appointment.patientId}
                              size="md"
                              fallback={appointment.patientName?.charAt(0) || "P"}
                              role="patient"
                            />
                          ) : (
                            <ProfileImage
                              userId={appointment.doctorId}
                              size="md"
                              fallback={appointment.doctorName?.charAt(0) || "D"}
                              role="doctor"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-graphite">
                            {initialViewMode === "doctor" ? appointment.patientName : appointment.doctorName}
                          </h3>
                        </div>
                      </div>
                      <div>{getStatusBadge(appointment.status)}</div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-drift-gray">
                      <div className="flex items-center">
                        <Calendar className="mr-1.5 h-4 w-4 text-soft-amber flex-shrink-0" />
                        <span className="truncate">{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1.5 h-4 w-4 text-soft-amber flex-shrink-0" />
                        {appointment.time || "Time not specified"}
                      </div>
                      {appointment.doctorName && (
                        <div className="flex items-center">
                          <User className="mr-1.5 h-4 w-4 text-soft-amber flex-shrink-0" />
                          <span className="truncate">Dr. {appointment.doctorName}</span>
                        </div>
                      )}
                      {appointment.location && (
                        <div className="flex items-center">
                          <MapPin className="mr-1.5 h-4 w-4 text-soft-amber flex-shrink-0" />
                          <span className="truncate">{appointment.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {appointment.symptoms && (
                    <div className="mt-3 border-t border-pale-stone pt-3">
                      <p className="text-sm text-drift-gray">
                        <span className="font-medium text-graphite">Symptoms/Reason: </span>
                        {appointment.symptoms}
                      </p>
                    </div>
                  )}

                  {appointment.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-drift-gray">
                        <span className="font-medium text-graphite">Notes: </span>
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                  <div className="mt-3 border-t border-pale-stone pt-3 flex justify-end">
                    {appointment.status === "completed" ? (
                      // For completed appointments, show the summary button if available
                      hasSummary(appointment) ? (
                        <button
                          onClick={() => handleViewSummary(appointment)}
                          className="inline-flex items-center rounded-md bg-soft-amber px-3 py-1.5 text-xs font-medium text-white hover:bg-soft-amber/90 transition-colors"
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          View Summary
                        </button>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-400 cursor-not-allowed"
                          title="Summary not available yet"
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          No Summary Available
                        </button>
                      )
                    ) : (
                      // For non-completed appointments, show the view details button
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        className="inline-flex items-center rounded-md bg-soft-amber/10 px-3 py-1.5 text-xs font-medium text-soft-amber hover:bg-soft-amber/20 transition-colors"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="rounded-lg border border-pale-stone bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pale-stone">
            <CalendarDays className="h-8 w-8 text-drift-gray" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-graphite">No Appointments Found</h3>
          <p className="mb-4 text-drift-gray">
            {searchTerm || filterStatus !== "all" || filterDate
              ? "No appointments match your search criteria. Try adjusting your filters."
              : "You don't have any appointment history yet."}
          </p>
        </div>
      )}

      {/* Replace the load more button with pagination controls */}
      {filteredAppointments.length > 0 && totalPages > 1 && (
        <div className="mt-6">
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && !showSummaryModal && (
        <AppointmentDetailsModal
          isOpen={true}
          onClose={() => setSelectedAppointment(null)}
          appointment={selectedAppointment}
          viewMode={initialViewMode}
          onCancel={handleCancelAppointment}
          onViewSummary={() => setShowSummaryModal(true)}
          fromHistory={true} // Pass fromHistory prop to hide cancel button
        />
      )}

      {/* Appointment Summary Modal */}
      {selectedAppointment && showSummaryModal && (
        <AppointmentSummaryModal
          isOpen={true}
          onClose={() => {
            setShowSummaryModal(false)
            setSelectedAppointment(null)
          }}
          appointment={selectedAppointment}
        />
      )}
    </div>
  )
}
