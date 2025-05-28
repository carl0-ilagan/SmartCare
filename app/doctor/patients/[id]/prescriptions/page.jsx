"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  Search,
  Calendar,
  Clock,
  Pill,
  SlidersHorizontal,
  X,
  LayoutGrid,
  LayoutList,
  FileText,
  User,
  Eye,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getPatientById } from "@/lib/doctor-utils"
import { getPrescriptionsForPatient } from "@/lib/prescription-utils"

export default function PatientPrescriptionsPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [patient, setPatient] = useState(null)
  const [prescriptions, setPrescriptions] = useState([]) // Initialize as empty array
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [viewMode, setViewMode] = useState("list") // 'list' or 'grid'
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [doctorInfo, setDoctorInfo] = useState(null)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showAll, setShowAll] = useState(false)

  // Get patient ID from URL
  const patientId = params.id

  // Load patient data and prescriptions
  useEffect(() => {
    if (!user || !patientId) return

    const loadData = async () => {
      setLoading(true)

      try {
        // Get patient data
        const patientData = await getPatientById(patientId)
        setPatient(patientData)

        // Get doctor info
        const { getUserProfile } = await import("@/lib/firebase-utils")
        const doctorData = await getUserProfile(user.uid)

        if (doctorData) {
          setDoctorInfo({
            name: doctorData.displayName || user.displayName || "Doctor",
            specialty: doctorData.specialty || "General Practitioner",
            licenseNumber: doctorData.licenseNumber || "PRC-10293847",
            clinicAddress: doctorData.officeAddress || "Room 203, St. Luke's Medical Center, Bonifacio Global City",
            contactNumber: doctorData.phone || doctorData.contactNumber || "+63 917 123 4567",
            ptrNumber: doctorData.ptrNumber || "N/A",
            s2Number: doctorData.s2Number || "N/A",
          })
        }

        // Get prescriptions for this patient by this doctor
        // Use the callback version of getPrescriptionsForPatient
        const unsubscribe = getPrescriptionsForPatient(patientId, user.uid, (prescriptionsData) => {
          // Filter out deleted prescriptions
          const activePrescriptions = prescriptionsData.filter((p) => p.status !== "deleted") || []
          setPrescriptions(activePrescriptions)
          setLoading(false)
        })

        // Store the unsubscribe function to clean up on unmount
        return () => unsubscribe()
      } catch (error) {
        console.error("Error loading data:", error)
        setPrescriptions([])
        setLoading(false)
      }
    }

    // Call loadData and store the cleanup function
    const cleanup = loadData()
    return () => {
      if (cleanup && typeof cleanup === "function") {
        cleanup()
      }
    }
  }, [user, patientId])

  // Filter and sort prescriptions - Add a safety check
  const filteredPrescriptions =
    prescriptions && prescriptions.length > 0
      ? prescriptions
          .filter((prescription) => {
            // Filter by search term
            const matchesSearch =
              (prescription.medications &&
                prescription.medications.some((med) => med.name.toLowerCase().includes(searchTerm.toLowerCase()))) ||
              (prescription.diagnosis && prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (prescription.instructions && prescription.instructions.toLowerCase().includes(searchTerm.toLowerCase()))

            // Filter by status
            const matchesStatus = filterStatus === "all" || prescription.status === filterStatus

            return matchesSearch && matchesStatus
          })
          .sort((a, b) => {
            // Sort by selected field
            if (sortBy === "date") {
              return sortOrder === "asc"
                ? new Date(a.createdAt) - new Date(b.createdAt)
                : new Date(b.createdAt) - new Date(a.createdAt)
            } else if (sortBy === "name") {
              const nameA = (a.medications && a.medications[0]?.name) || ""
              const nameB = (b.medications && b.medications[0]?.name) || ""
              return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
            }
            return 0
          })
      : [] // Return empty array if prescriptions is null/undefined or empty

  // Get paginated prescriptions
  const paginatedPrescriptions = showAll ? filteredPrescriptions : filteredPrescriptions.slice(0, itemsPerPage)

  // Navigate back to patient details
  const handleBackToPatient = () => {
    router.push(`/doctor/patients/${patientId}`)
  }

  // Create new prescription
  const handleCreatePrescription = () => {
    router.push(`/doctor/prescriptions/new?patientId=${patientId}`)
  }

  // View prescription details
  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription)
    setShowPrescriptionModal(true)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setFilterStatus("all")
    setSortBy("date")
    setSortOrder("desc")
  }

  // Toggle view mode between list and grid
  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list")
  }

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "N/A"
      return date.toLocaleDateString()
    } catch (error) {
      return "N/A"
    }
  }

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return "N/A"

    try {
      const today = new Date()
      const birthDate = new Date(birthdate)

      // Check if the date is valid
      if (isNaN(birthDate.getTime())) return "N/A"

      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDifference = today.getMonth() - birthDate.getMonth()

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      return age.toString()
    } catch (error) {
      console.error("Error calculating age:", error)
      return "N/A"
    }
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Active</span>
        )
      case "completed":
        return (
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">Completed</span>
        )
      case "cancelled":
        return <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Cancelled</span>
      default:
        return null
    }
  }

  // Render prescription in list view
  const renderListPrescription = (prescription, index) => {
    return (
      <div
        key={prescription.id}
        className="group cursor-pointer rounded-lg border border-pale-stone bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-soft-amber/30"
        style={{
          animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
          opacity: 0,
        }}
        onClick={() => handleViewPrescription(prescription)}
      >
        <div className="flex items-start">
          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-soft-amber/10 text-soft-amber">
            <Pill className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-graphite group-hover:text-soft-amber transition-colors">
                {prescription.medications && prescription.medications.map((med) => med.name).join(", ")}
              </h3>
              {getStatusBadge(prescription.status)}
            </div>
            {prescription.diagnosis && (
              <p className="mt-1 text-sm text-drift-gray">Diagnosis: {prescription.diagnosis}</p>
            )}
            <div className="mt-2 flex items-center text-xs text-drift-gray">
              <Calendar className="mr-1 h-3 w-3" />
              <span className="mr-3">Created: {formatDate(prescription.createdAt)}</span>
              {prescription.expiryDate && (
                <>
                  <Clock className="mr-1 h-3 w-3" />
                  <span>Expires: {formatDate(prescription.expiryDate)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleViewPrescription(prescription)
            }}
            className="rounded-md border border-soft-amber bg-white px-3 py-1 text-xs font-medium text-soft-amber transition-colors hover:bg-soft-amber/10"
          >
            <Eye className="mr-1 h-3 w-3 inline" />
            View Prescription
          </button>
        </div>
      </div>
    )
  }

  // Render prescription in grid view
  const renderGridPrescription = (prescription, index) => {
    return (
      <div
        key={prescription.id}
        className="group cursor-pointer rounded-lg border border-pale-stone bg-white shadow-sm transition-all hover:shadow-md hover:border-soft-amber/30"
        style={{
          animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
          opacity: 0,
        }}
        onClick={() => handleViewPrescription(prescription)}
      >
        <div className="h-2 w-full bg-soft-amber/20"></div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-amber/10 text-soft-amber">
              <Pill className="h-5 w-5" />
            </div>
            {getStatusBadge(prescription.status)}
          </div>

          <h3 className="font-medium text-graphite group-hover:text-soft-amber transition-colors mb-2 line-clamp-1">
            {prescription.medications && prescription.medications.map((med) => med.name).join(", ")}
          </h3>

          {prescription.diagnosis && (
            <p className="text-sm text-drift-gray line-clamp-2 mb-3">Diagnosis: {prescription.diagnosis}</p>
          )}

          <div className="border-t border-pale-stone pt-2 flex flex-col gap-1">
            <div className="flex items-center text-xs text-drift-gray">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Created: {formatDate(prescription.createdAt)}</span>
            </div>
            {prescription.expiryDate && (
              <div className="flex items-center text-xs text-drift-gray">
                <Clock className="mr-1 h-3 w-3" />
                <span>Expires: {formatDate(prescription.expiryDate)}</span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleViewPrescription(prescription)
              }}
              className="mt-2 w-full rounded-md border border-soft-amber bg-white px-3 py-1 text-xs font-medium text-soft-amber transition-colors hover:bg-soft-amber/10"
            >
              <Eye className="mr-1 h-3 w-3 inline" />
              View Prescription
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-soft-amber/90 to-amber-500 p-6 shadow-md">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10"></div>

        <div className="relative z-10">
          <button
            onClick={handleBackToPatient}
            className="mb-4 inline-flex items-center rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/30"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Patient
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              {!loading && patient ? (
                <>
                  {patient.photoURL ? (
                    <img
                      src={patient.photoURL || "/placeholder.svg"}
                      alt={patient.displayName}
                      className="mr-4 h-16 w-16 rounded-full border-2 border-white/50 object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/vibrant-street-market.png"
                      }}
                    />
                  ) : (
                    <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white">
                      <User className="h-8 w-8" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-white md:text-3xl">Prescriptions</h1>
                    <p className="mt-1 text-amber-50">{patient.displayName}'s prescriptions</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mr-4 h-16 w-16 animate-pulse rounded-full bg-white/20"></div>
                  <div>
                    <div className="h-7 w-48 animate-pulse rounded-md bg-white/20 mb-2"></div>
                    <div className="h-5 w-32 animate-pulse rounded-md bg-white/20"></div>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={handleCreatePrescription}
              className="mt-4 md:mt-0 inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-soft-amber shadow-sm transition-colors hover:bg-white/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Prescription
            </button>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleViewMode}
            className="inline-flex items-center rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite shadow-sm transition-colors hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
          >
            {viewMode === "list" ? (
              <>
                <LayoutGrid className="mr-2 h-4 w-4" />
                Grid View
              </>
            ) : (
              <>
                <LayoutList className="mr-2 h-4 w-4" />
                List View
              </>
            )}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite shadow-sm transition-colors hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {(filterStatus !== "all" || sortBy !== "date" || sortOrder !== "desc") && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-soft-amber text-xs text-white">
                {(filterStatus !== "all" ? 1 : 0) + (sortBy !== "date" || sortOrder !== "desc" ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm animate-slideDown">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-graphite">Filter & Sort</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="rounded-full p-1 text-drift-gray hover:bg-pale-stone"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="filterStatus" className="text-sm font-medium text-graphite">
                Status
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="sortBy" className="text-sm font-medium text-graphite">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              >
                <option value="date">Date</option>
                <option value="name">Medication Name</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="sortOrder" className="text-sm font-medium text-graphite">
                Sort Order
              </label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="inline-flex items-center rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {loading ? (
        // Loading state
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber mb-4"></div>
            <p className="text-drift-gray">Loading prescriptions...</p>
          </div>
        </div>
      ) : filteredPrescriptions.length > 0 ? (
        // Prescriptions list
        viewMode === "list" ? (
          <div className="space-y-4">
            {paginatedPrescriptions.map((prescription, index) => renderListPrescription(prescription, index))}

            {!showAll && filteredPrescriptions.length > itemsPerPage && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite shadow-sm transition-colors hover:bg-pale-stone"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedPrescriptions.map((prescription, index) => renderGridPrescription(prescription, index))}

            {!showAll && filteredPrescriptions.length > itemsPerPage && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite shadow-sm transition-colors hover:bg-pale-stone"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        // No prescriptions
        <div className="rounded-lg border border-pale-stone bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pale-stone">
            <FileText className="h-8 w-8 text-drift-gray" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-graphite">No Prescriptions Found</h3>
          <p className="mb-4 text-drift-gray">
            {searchTerm || filterStatus !== "all"
              ? "No prescriptions match your search criteria. Try adjusting your filters."
              : `You haven't created any prescriptions for ${patient?.displayName || "this patient"} yet.`}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleBackToPatient}
              className="inline-flex items-center rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite shadow-sm transition-colors hover:bg-pale-stone"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patient Profile
            </button>
            <button
              onClick={handleCreatePrescription}
              className="inline-flex items-center rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Prescription
            </button>
          </div>
        </div>
      )}

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
                        Dr. {doctorInfo?.name || user?.displayName || "Doctor Name"}
                      </div>
                      <div className="text-xs">
                        {doctorInfo?.specialty || "General Practitioner"} | PRC #
                        {doctorInfo?.licenseNumber || "License"}
                      </div>
                      <div className="text-xs">{doctorInfo?.clinicAddress || "Clinic Address"}</div>
                      <div className="text-xs">Contact No.: {doctorInfo?.contactNumber || "Contact Number"}</div>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1 text-xs">
                    <div>Date: {formatDate(selectedPrescription.createdAt || new Date())}</div>
                    <div>Patient Name: {patient?.displayName || "_______"}</div>
                    <div>
                      Age: {calculateAge(patient?.dateOfBirth || patient?.dob) || "____"} &nbsp;&nbsp; Sex:{" "}
                      {patient?.gender || "____"}
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
                    <div>Dr. {doctorInfo?.name || user?.displayName}</div>
                    <div>License No.: PRC {doctorInfo?.licenseNumber || "License Number"}</div>
                    <div>PTR No.: {doctorInfo?.ptrNumber || "PTR Number"}</div>
                    <div>S2 No.: {doctorInfo?.s2Number || "S2 Number"}</div>
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
                onClick={() => setShowPrescriptionModal(false)}
                className="rounded-md bg-soft-amber px-3 py-1 text-xs font-medium text-white shadow-sm transition-colors hover:bg-amber-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset pagination when filters change */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

// Reset pagination when filters change
