"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Pill,
  Calendar,
  Download,
  CheckCircle,
  AlertCircle,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { getPatientPrescriptions, generatePrintablePrescription } from "@/lib/prescription-utils"
import { generatePrescriptionPDF } from "@/lib/pdf-utils"
import { SuccessNotification } from "@/components/success-notification"
import { useAuth } from "@/contexts/auth-context"
import ProfileImage from "@/components/profile-image"
import { DashboardHeaderBanner } from "@/components/dashboard-header-banner"

export default function PatientPrescriptionsPage() {
  const { user } = useAuth()
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [notification, setNotification] = useState({ message: "", isVisible: false })
  const [patientInfo, setPatientInfo] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  // Add this function inside the component but outside any other functions:
  const calculateAge = (birthdate) => {
    if (!birthdate) return null

    try {
      const today = new Date()
      const birthDate = new Date(birthdate)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDifference = today.getMonth() - birthDate.getMonth()

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      return age
    } catch (error) {
      console.error("Error calculating age:", error)
      return null
    }
  }

  // Fetch patient info and prescriptions
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      setLoading(true)
      try {
        // Get patient profile
        const { getUserProfile } = await import("@/lib/firebase-utils")
        const userData = await getUserProfile(user.uid)

        if (userData) {
          const calculatedAge = calculateAge(userData.dateOfBirth)
          setPatientInfo({
            id: user.uid,
            name: userData.displayName || user.displayName || "Patient",
            age: userData.age || calculatedAge || "N/A",
            gender: userData.gender || "Not specified",
            dateOfBirth: userData.dateOfBirth,
          })
        }

        // Get prescriptions
        const result = await getPatientPrescriptions(user.uid)
        if (result.success) {
          // Process prescriptions to ensure they have the right format
          const processedPrescriptions = result.prescriptions.map((prescription) => {
            // Convert Firestore timestamp to Date if needed
            const createdAt = prescription.createdAt?.seconds
              ? new Date(prescription.createdAt.seconds * 1000)
              : new Date()

            // Ensure medications is an array
            const medications = prescription.medications || [
              {
                name: prescription.medication || "Unknown medication",
                dosage: prescription.dosage || "N/A",
                frequency: prescription.frequency || "N/A",
                duration: prescription.duration || "N/A",
                instructions: prescription.notes || "",
              },
            ]

            return {
              ...prescription,
              createdAt,
              medications,
              status: prescription.status || "active",
            }
          })

          setPrescriptions(processedPrescriptions)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Fetch doctor information
  const fetchDoctorInfo = async (doctorId) => {
    if (!doctorId) return null

    try {
      const { getUserProfile } = await import("@/lib/firebase-utils")
      const doctorData = await getUserProfile(doctorId)

      if (doctorData) {
        return {
          name: doctorData.displayName || "Doctor",
          specialty: doctorData.specialty || "General Practitioner",
          licenseNumber: doctorData.licenseNumber || "License",
          clinicAddress: doctorData.officeAddress || "Clinic Address",
          contactNumber: doctorData.phone || doctorData.contactNumber || "Contact Number",
          ptrNumber: doctorData.ptrNumber || "PTR Number",
          s2Number: doctorData.s2Number || "S2 Number",
        }
      }
    } catch (error) {
      console.error("Error fetching doctor info:", error)
    }

    return null
  }

  // Now update the handleViewPrescription function to fetch doctor info
  const handleViewPrescription = async (prescription) => {
    setSelectedPrescription(prescription)

    // Fetch doctor info if we have the doctorId
    if (prescription.doctorId) {
      const doctorInfo = await fetchDoctorInfo(prescription.doctorId)
      if (doctorInfo) {
        // Update the prescription with doctor info
        setSelectedPrescription({
          ...prescription,
          doctorInfo,
        })
      }
    }

    setShowPrescriptionModal(true)
  }

  // Filter prescriptions
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    // Filter by search term
    const matchesSearch =
      prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medications.some(
        (med) =>
          med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.instructions?.toLowerCase().includes(searchTerm.toLowerCase()),
      )

    // Filter by status
    const matchesStatus = filterStatus === "all" || prescription.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Update total pages when filtered prescriptions change
  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(filteredPrescriptions.length / itemsPerPage)))
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [filteredPrescriptions.length, itemsPerPage])

  // Get paginated prescriptions
  const paginatedPrescriptions = filteredPrescriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Handle pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always show first page
      pageNumbers.push(1)

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4)
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3)
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push("...")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Always show last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  // Handle prescription download/print
  const handlePrintPrescription = (prescription) => {
    try {
      // Generate printable prescription
      const printWindow = generatePrintablePrescription(
        prescription,
        {
          name: prescription.doctorName,
          specialty: "General Practitioner", // In a real app, this would come from the prescription data
          licenseNumber: "1234567",
          clinicAddress: "123 Health St., Quezon City, Philippines",
          contactNumber: "(02) 1234-5678",
          ptrNumber: "2025-0001234",
          s2Number: "S2-123456",
        },
        patientInfo,
      )

      // Trigger print dialog
      setTimeout(() => {
        printWindow.print()
      }, 500)

      setNotification({
        message: "Prescription ready to print",
        isVisible: true,
      })
    } catch (error) {
      console.error("Error generating print preview:", error)
      setNotification({
        message: "Error generating print preview",
        isVisible: true,
      })
    }
  }

  // Handle PDF download
  const handleDownloadPDF = (prescription) => {
    try {
      // Generate PDF
      const doc = generatePrescriptionPDF(
        prescription,
        {
          name: prescription.doctorName,
          specialty: "General Practitioner", // In a real app, this would come from the prescription data
          licenseNumber: "1234567",
          clinicAddress: "123 Health St., Quezon City, Philippines",
          contactNumber: "(02) 1234-5678",
          ptrNumber: "2025-0001234",
          s2Number: "S2-123456",
        },
        patientInfo,
      )

      // Save the PDF
      doc.save(`prescription_${patientInfo.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`)

      setNotification({
        message: "PDF downloaded successfully",
        isVisible: true,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      setNotification({
        message: "Error generating PDF",
        isVisible: true,
      })
    }
  }

  // Get status info
  const getStatusInfo = (status) => {
    switch (status) {
      case "active":
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          color: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
          label: "Active",
        }
      case "expired":
        return {
          icon: <AlertCircle className="h-4 w-4 text-amber-600" />,
          color: "bg-amber-100",
          textColor: "text-amber-800",
          borderColor: "border-amber-200",
          label: "Expired",
        }
      case "completed":
        return {
          icon: <FileText className="h-4 w-4 text-blue-600" />,
          color: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
          label: "Completed",
        }
      default:
        return {
          icon: <FileText className="h-4 w-4 text-gray-600" />,
          color: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
          label: "Unknown",
        }
    }
  }

  // Create download button for header
  const downloadButton = (
    <button
      onClick={() => prescriptions.length > 0 && handleDownloadPDF(prescriptions[0])}
      disabled={prescriptions.length === 0 || loading}
      className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-soft-amber shadow-sm transition-all hover:bg-amber-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 animate-fadeIn"
    >
      <Download className="mr-2 h-4 w-4" />
      Download Latest
    </button>
  )

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dashboard Header Banner with page-specific content */}
      <DashboardHeaderBanner
        userRole="patient"
        title="My Prescriptions"
        subtitle="View and download your prescriptions"
        actionButton={downloadButton}
        showMetrics={false}
      />

      {/* Search and Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
          <input
            type="text"
            placeholder="Search by doctor or medication..."
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
          {filterStatus !== "all" && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-soft-amber text-xs text-white">
              1
            </span>
          )}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="rounded-lg border border-earth-beige bg-white p-4 shadow-sm animate-slideDown">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0">
            <div className="flex-1 space-y-2">
              <label htmlFor="filterStatus" className="text-sm font-medium text-graphite">
                Status
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex-1 space-y-2">
              <label htmlFor="itemsPerPage" className="text-sm font-medium text-graphite">
                Items Per Page
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
            <button
              onClick={() => setFilterStatus("all")}
              className="inline-flex items-center rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Prescriptions List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-soft-amber border-t-transparent"></div>
            <span className="ml-3 text-drift-gray">Loading prescriptions...</span>
          </div>
        ) : filteredPrescriptions.length > 0 ? (
          <div className="space-y-4">
            {paginatedPrescriptions.map((prescription) => {
              const statusInfo = getStatusInfo(prescription.status)
              const date = new Date(prescription.createdAt)
              const formattedDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })

              return (
                <div
                  key={prescription.id}
                  className="overflow-hidden rounded-lg border-l-4 border-l-soft-amber border-earth-beige bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between p-3">
                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                      <Pill className="h-5 w-5 text-soft-amber" />
                      <div>
                        <div className="flex items-center flex-wrap">
                          <h3 className="font-medium text-graphite mr-2">
                            {prescription.medications[0].name}
                            {prescription.medications.length > 1 && (
                              <span className="ml-1 text-xs text-drift-gray">
                                +{prescription.medications.length - 1}
                              </span>
                            )}
                          </h3>
                          <span
                            className={`rounded-full ${statusInfo.color} px-2 py-0.5 text-xs font-medium ${statusInfo.textColor}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-drift-gray">
                          {prescription.medications[0].dosage}, {prescription.medications[0].frequency}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <ProfileImage userId={prescription.doctorId} role="doctor" size="xs" className="mr-1.5" />
                        <span className="text-xs text-drift-gray">{prescription.doctorName}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1.5 h-3.5 w-3.5 text-drift-gray" />
                        <span className="text-xs text-drift-gray">{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 border-t border-earth-beige bg-pale-stone/30 px-3 py-1.5">
                    <button
                      onClick={() => handleViewPrescription(prescription)}
                      className="rounded-md border border-earth-beige bg-white px-2.5 py-1 text-xs font-medium text-graphite transition-colors hover:bg-pale-stone"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(prescription)}
                      className="inline-flex items-center rounded-md bg-soft-amber px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
                    >
                      <Download className="mr-1 h-3.5 w-3.5" />
                      PDF
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-1 mt-6">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center rounded-md border p-2 ${
                    currentPage === 1
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-earth-beige text-graphite hover:bg-pale-stone"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${page}`}
                      onClick={() => goToPage(page)}
                      className={`min-w-[2rem] rounded-md px-3 py-2 text-sm font-medium ${
                        currentPage === page ? "bg-soft-amber text-white" : "text-graphite hover:bg-pale-stone"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center rounded-md border p-2 ${
                    currentPage === totalPages
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-earth-beige text-graphite hover:bg-pale-stone"
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-pale-stone bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pale-stone">
              <FileText className="h-8 w-8 text-drift-gray" />
            </div>
            <h3 className="mb-1 text-lg font-medium text-graphite">No Prescriptions Found</h3>
            <p className="mb-4 text-drift-gray">
              {searchTerm || filterStatus !== "all"
                ? "No prescriptions match your search criteria. Try adjusting your filters."
                : "You don't have any prescriptions yet."}
            </p>
          </div>
        )}
      </div>

      {/* Prescription Preview Modal */}
      {showPrescriptionModal && selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
          <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-pale-stone p-2">
              <h3 className="text-xs font-medium text-graphite">Prescription Preview</h3>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="rounded-full p-1 text-drift-gray hover:bg-pale-stone"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Prescription preview - matching the new prescription page preview */}
            <div className="p-3">
              <div className="overflow-hidden rounded-lg border border-earth-beige bg-white">
                <div className="p-3">
                  <div className="relative border-b border-gray-300 pb-3 text-center">
                    <div className="absolute left-0 top-0 text-xl font-bold italic text-soft-amber">Rx</div>
                    <div className="doctor-info">
                      <div className="text-sm font-bold">
                        Dr. {selectedPrescription.doctorInfo?.name || selectedPrescription.doctorName || "Doctor Name"}
                      </div>
                      <div className="text-xs">
                        {selectedPrescription.doctorInfo?.specialty || "General Practitioner"} | PRC #
                        {selectedPrescription.doctorInfo?.licenseNumber || "License"}
                      </div>
                      <div className="text-xs">
                        {selectedPrescription.doctorInfo?.clinicAddress || "Clinic Address"}
                      </div>
                      <div className="text-xs">
                        Contact No.: {selectedPrescription.doctorInfo?.contactNumber || "Contact Number"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1 text-xs">
                    <div>Date: {new Date(selectedPrescription.createdAt || Date.now()).toLocaleDateString()}</div>
                    <div>Patient Name: {patientInfo?.name || user?.displayName || "_______"}</div>
                    <div>
                      Age: {patientInfo?.age || calculateAge(patientInfo?.dateOfBirth) || "N/A"} &nbsp;&nbsp; Sex:{" "}
                      {patientInfo?.gender || "Not specified"}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-sm font-bold text-soft-amber">Rx:</div>

                    <div className="mt-1 space-y-2 text-xs">
                      {selectedPrescription.medications && selectedPrescription.medications.length > 0 ? (
                        selectedPrescription.medications.map((med, index) => (
                          <div key={index} className="ml-2">
                            <div>
                              <span className="font-bold">{index + 1}.</span> {med.name}
                            </div>
                            <div className="ml-3">
                              {med.dosage}, {med.frequency}, {med.duration}
                            </div>
                            {med.instructions && (
                              <div className="ml-3 italic text-drift-gray text-xs">{med.instructions}</div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="ml-2 text-drift-gray italic">(No medications)</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-1 pt-4 text-xs">
                    {selectedPrescription.signature ? (
                      <div className="mb-1">
                        <img
                          src={selectedPrescription.signature || "/placeholder.svg"}
                          alt="Signature"
                          className="max-h-12"
                        />
                      </div>
                    ) : (
                      <div className="mb-2 border-b border-gray-400 w-32"></div>
                    )}
                    <div>Dr. {selectedPrescription.doctorInfo?.name || selectedPrescription.doctorName}</div>
                    <div>License No.: PRC {selectedPrescription.doctorInfo?.licenseNumber || "License Number"}</div>
                    <div>PTR No.: {selectedPrescription.doctorInfo?.ptrNumber || "PTR Number"}</div>
                    <div>S2 No.: {selectedPrescription.doctorInfo?.s2Number || "S2 Number"}</div>
                  </div>

                  <div className="mt-4 border-t border-gray-300 pt-2 text-center text-xs text-gray-500">
                    This prescription is electronically generated via Smart Care Health System
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end border-t border-pale-stone p-2">
              <button
                onClick={() => handleDownloadPDF(selectedPrescription)}
                className="mr-2 rounded-md bg-soft-amber px-3 py-1 text-xs font-medium text-white shadow-sm transition-colors hover:bg-amber-600"
              >
                Download PDF
              </button>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="rounded-md border border-earth-beige bg-white px-3 py-1 text-xs font-medium text-graphite transition-colors hover:bg-pale-stone"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      <SuccessNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </div>
  )
}
