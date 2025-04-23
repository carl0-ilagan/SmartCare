"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
import { Search, Filter, Pill, Calendar, Download, User, CheckCircle, AlertCircle, FileText } from "lucide-react"
import { getPatientPrescriptions, generatePrintablePrescription } from "@/lib/prescription-utils"
import { generatePrescriptionPDF } from "@/lib/pdf-utils"
import { PrescriptionDetailModal } from "@/components/prescription-detail-modal"
import { SuccessNotification } from "@/components/success-notification"
import { useAuth } from "@/contexts/auth-context"

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
          setPatientInfo({
            id: user.uid,
            name: userData.displayName || user.displayName || "Patient",
            age: userData.age || calculateAge(userData.dateOfBirth) || "N/A",
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

  // Add the calculateAge function if it's not already imported
  const calculateAge = (birthdate) => {
    if (!birthdate) return null

    const today = new Date()
    const birthDate = new Date(birthdate)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
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
=======
import { useState } from "react"
import { ChevronDown, ChevronUp, Download, Filter, Search, User, X } from "lucide-react"
import { SuccessNotification } from "@/components/success-notification"

export default function PatientPrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [notification, setNotification] = useState({ message: "", isVisible: false })
  const [selectedPrescription, setSelectedPrescription] = useState(null)

  // Mock prescriptions data
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "2023-06-01",
      endDate: "2023-12-01",
      status: "active",
      notes: "Take with food in the morning",
    },
    {
      id: 2,
      doctor: "Dr. Sarah Johnson",
      medication: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      startDate: "2023-06-01",
      endDate: "2023-12-01",
      status: "active",
      notes: "Take in the evening",
    },
    {
      id: 3,
      doctor: "Dr. Michael Chen",
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      startDate: "2023-05-15",
      endDate: "2023-11-15",
      status: "active",
      notes: "Take with meals",
    },
    {
      id: 4,
      doctor: "Dr. Robert Wilson",
      medication: "Prednisone",
      dosage: "5mg",
      frequency: "Once daily",
      startDate: "2023-05-10",
      endDate: "2023-06-10",
      status: "expired",
      notes: "Take in the morning with food",
    },
    {
      id: 5,
      doctor: "Dr. Emily Davis",
      medication: "Albuterol",
      dosage: "90mcg",
      frequency: "As needed",
      startDate: "2023-06-05",
      endDate: null,
      status: "active",
      notes: "Use inhaler for shortness of breath, up to 4 times daily",
    },
    {
      id: 7,
      doctor: "Dr. Michael Chen",
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      startDate: "2023-05-01",
      endDate: "2023-05-14",
      status: "completed",
      notes: "Take until all pills are gone, even if feeling better",
    },
  ])

  // Filter prescriptions
  const filteredPrescriptions = prescriptions
    .filter((prescription) => {
      // Filter by search term
      const matchesSearch =
        prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.notes.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by status
      const matchesStatus = filterStatus === "all" || prescription.status === filterStatus

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Sort by date (most recent first)
      return new Date(b.startDate) - new Date(a.startDate)
    })

  // Handle prescription download
  const handleDownloadPrescription = (prescription) => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading prescription:", prescription)

    // Show success notification
    setNotification({
      message: `Prescription for ${prescription.medication} downloaded`,
      isVisible: true,
    })
  }
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

  // Handle prescription view
  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription)
<<<<<<< HEAD
    setShowPrescriptionModal(true)
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-soft-amber/90 to-amber-500 p-6 shadow-md">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10"></div>

        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white md:text-3xl">My Prescriptions</h1>
          <p className="mt-1 text-amber-50">View and download your prescriptions</p>
        </div>
      </div>

      {/* Search and Filters */}
=======
  }

  // Close prescription detail view
  const handleCloseDetail = () => {
    setSelectedPrescription(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite md:text-3xl">My Prescriptions</h1>
      </div>

>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
          <input
            type="text"
<<<<<<< HEAD
            placeholder="Search by doctor or medication..."
=======
            placeholder="Search by doctor, medication, or notes..."
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
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
<<<<<<< HEAD
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
=======
          {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </button>
      </div>

      {showFilters && (
        <div className="rounded-lg border border-earth-beige bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-graphite">
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
                Status
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
<<<<<<< HEAD
                className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
=======
                className="mt-1 rounded-md border border-earth-beige bg-white py-1 pl-3 pr-10 text-sm text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="completed">Completed</option>
              </select>
            </div>
<<<<<<< HEAD
            <button
              onClick={() => setFilterStatus("all")}
              className="inline-flex items-center rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone"
            >
              Clear Filters
            </button>
=======
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* Prescriptions List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-soft-amber border-t-transparent"></div>
            <span className="ml-3 text-drift-gray">Loading prescriptions...</span>
          </div>
        ) : filteredPrescriptions.length > 0 ? (
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription) => {
              const statusInfo = getStatusInfo(prescription.status)
              const date = new Date(prescription.createdAt)
              const formattedDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })

              return (
                <div
                  key={prescription.id}
                  className="overflow-hidden rounded-lg border border-l-4 border-l-soft-amber border-earth-beige bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-3 sm:mb-0">
                      <div className="flex items-center">
                        <Pill className="mr-2 h-5 w-5 text-soft-amber" />
                        <h3 className="font-medium text-graphite">
                          {prescription.medications[0].name}
                          {prescription.medications.length > 1 && ` + ${prescription.medications.length - 1} more`}
                        </h3>
                        <span
                          className={`ml-2 rounded-full ${statusInfo.color} px-2.5 py-0.5 text-xs font-medium ${statusInfo.textColor}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-drift-gray">
                        {prescription.medications[0].dosage}, {prescription.medications[0].frequency}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                        <User className="mr-2 h-4 w-4 text-soft-amber" />
                        <span className="text-sm text-graphite">{prescription.doctorName}</span>
                      </div>
                      <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                        <Calendar className="mr-2 h-4 w-4 text-soft-amber" />
                        <span className="text-sm text-graphite">{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewPrescription(prescription)}
                      className="rounded-md border border-earth-beige bg-white px-3 py-1 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(prescription)}
                      className="inline-flex items-center rounded-md bg-soft-amber px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                    >
                      Download PDF
                      <Download className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-pale-stone bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pale-stone">
              <FileText className="h-8 w-8 text-drift-gray" />
=======
      <div className="space-y-4">
        {filteredPrescriptions.length > 0 ? (
          <>
            {/* Active Prescriptions */}
            {filteredPrescriptions.some((p) => p.status === "active") && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-graphite">Active Prescriptions</h2>
                <div className="rounded-lg border border-pale-stone bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-pale-stone bg-pale-stone text-left text-sm font-medium text-graphite">
                          <th className="px-4 py-3">Doctor</th>
                          <th className="px-4 py-3">Medication</th>
                          <th className="px-4 py-3">Dosage</th>
                          <th className="px-4 py-3">Frequency</th>
                          <th className="px-4 py-3">Start Date</th>
                          <th className="px-4 py-3">End Date</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPrescriptions
                          .filter((p) => p.status === "active")
                          .map((prescription) => (
                            <tr key={prescription.id} className="border-b border-pale-stone hover:bg-pale-stone/30">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-pale-stone">
                                    <User className="h-full w-full p-1.5 text-drift-gray" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="font-medium text-graphite">{prescription.doctor}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-medium text-graphite">{prescription.medication}</td>
                              <td className="px-4 py-3 text-drift-gray">{prescription.dosage}</td>
                              <td className="px-4 py-3 text-drift-gray">{prescription.frequency}</td>
                              <td className="px-4 py-3 text-drift-gray">
                                {new Date(prescription.startDate).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-drift-gray">
                                {prescription.endDate
                                  ? new Date(prescription.endDate).toLocaleDateString()
                                  : "No end date"}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewPrescription(prescription)}
                                    className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                                    title="View Details"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                      <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <span className="sr-only">View</span>
                                  </button>
                                  <button
                                    onClick={() => handleDownloadPrescription(prescription)}
                                    className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                                    title="Download Prescription"
                                  >
                                    <Download className="h-4 w-4" />
                                    <span className="sr-only">Download</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Expired Prescriptions */}
            {filteredPrescriptions.some((p) => p.status === "expired") && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-graphite">Expired Prescriptions</h2>
                <div className="rounded-lg border border-pale-stone bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-pale-stone bg-pale-stone text-left text-sm font-medium text-graphite">
                          <th className="px-4 py-3">Doctor</th>
                          <th className="px-4 py-3">Medication</th>
                          <th className="px-4 py-3">Dosage</th>
                          <th className="px-4 py-3">Frequency</th>
                          <th className="px-4 py-3">Start Date</th>
                          <th className="px-4 py-3">End Date</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPrescriptions
                          .filter((p) => p.status === "expired")
                          .map((prescription) => (
                            <tr
                              key={prescription.id}
                              className="border-b border-pale-stone opacity-70 hover:bg-pale-stone/30"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-pale-stone">
                                    <User className="h-full w-full p-1.5 text-drift-gray" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="font-medium text-graphite">{prescription.doctor}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-medium text-graphite">{prescription.medication}</td>
                              <td className="px-4 py-3 text-drift-gray">{prescription.dosage}</td>
                              <td className="px-4 py-3 text-drift-gray">{prescription.frequency}</td>
                              <td className="px-4 py-3 text-drift-gray">
                                {new Date(prescription.startDate).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-drift-gray">
                                {prescription.endDate
                                  ? new Date(prescription.endDate).toLocaleDateString()
                                  : "No end date"}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewPrescription(prescription)}
                                    className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                                    title="View Details"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                      <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <span className="sr-only">View</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Completed Prescriptions */}
            {filteredPrescriptions.some((p) => p.status === "completed") && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-graphite">Completed Prescriptions</h2>
                <div className="rounded-lg border border-pale-stone bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-pale-stone bg-pale-stone text-left text-sm font-medium text-graphite">
                          <th className="px-4 py-3">Doctor</th>
                          <th className="px-4 py-3">Medication</th>
                          <th className="px-4 py-3">Dosage</th>
                          <th className="px-4 py-3">Frequency</th>
                          <th className="px-4 py-3">Start Date</th>
                          <th className="px-4 py-3">End Date</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPrescriptions
                          .filter((p) => p.status === "completed")
                          .map((prescription) => (
                            <tr
                              key={prescription.id}
                              className="border-b border-pale-stone opacity-70 hover:bg-pale-stone/30"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-pale-stone">
                                    <User className="h-full w-full p-1.5 text-drift-gray" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="font-medium text-graphite">{prescription.doctor}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-medium text-graphite">{prescription.medication}</td>
                              <td className="px-4 py-3 text-drift-gray">{prescription.dosage}</td>
                              <td className="px-4 py-3 text-drift-gray">{prescription.frequency}</td>
                              <td className="px-4 py-3 text-drift-gray">
                                {new Date(prescription.startDate).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-drift-gray">
                                {prescription.endDate
                                  ? new Date(prescription.endDate).toLocaleDateString()
                                  : "No end date"}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewPrescription(prescription)}
                                    className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                                    title="View Details"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                      <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <span className="sr-only">View</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-pale-stone bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pale-stone">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-drift-gray"
              >
                <path d="M8 21h8a2 2 0 0 0 2-2v-2H6v2a2 2 0 0 0 2 2Z" />
                <path d="M19 7v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7" />
                <path d="M21 10V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2l3 3h12l3-3Z" />
                <path d="M10 2v4" />
                <path d="M14 2v4" />
              </svg>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
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

      {/* Prescription Detail Modal */}
<<<<<<< HEAD
      <PrescriptionDetailModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        prescription={selectedPrescription}
        onEdit={() => {}} // Not editable by patients
        onDownload={() => selectedPrescription && handleDownloadPDF(selectedPrescription)}
      />
=======
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={handleCloseDetail}></div>
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <button
              onClick={handleCloseDetail}
              className="absolute right-4 top-4 rounded-full p-1 text-drift-gray transition-colors hover:bg-pale-stone hover:text-soft-amber"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            <h2 className="mb-4 text-xl font-semibold text-graphite">Prescription Details</h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-pale-stone">
                  <User className="h-full w-full p-2 text-drift-gray" />
                </div>
                <div>
                  <p className="font-medium text-graphite">{selectedPrescription.doctor}</p>
                </div>
              </div>

              <div className="rounded-lg border border-pale-stone bg-pale-stone/30 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-drift-gray">Medication</p>
                    <p className="font-medium text-graphite">{selectedPrescription.medication}</p>
                  </div>
                  <div>
                    <p className="text-sm text-drift-gray">Dosage</p>
                    <p className="font-medium text-graphite">{selectedPrescription.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-drift-gray">Frequency</p>
                    <p className="font-medium text-graphite">{selectedPrescription.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-drift-gray">Status</p>
                    <p className="font-medium capitalize text-graphite">{selectedPrescription.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-drift-gray">Start Date</p>
                    <p className="font-medium text-graphite">
                      {new Date(selectedPrescription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-drift-gray">End Date</p>
                    <p className="font-medium text-graphite">
                      {selectedPrescription.endDate
                        ? new Date(selectedPrescription.endDate).toLocaleDateString()
                        : "No end date"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-drift-gray">Notes</p>
                  <p className="text-graphite">{selectedPrescription.notes}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    handleDownloadPrescription(selectedPrescription)
                    handleCloseDetail()
                  }}
                  className="inline-flex items-center rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

      {/* Success Notification */}
      <SuccessNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </div>
  )
}
