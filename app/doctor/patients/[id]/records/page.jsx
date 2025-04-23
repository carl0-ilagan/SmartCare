"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  FileText,
  Search,
  Calendar,
  Clock,
  FileIcon,
  SlidersHorizontal,
  X,
  LayoutGrid,
  LayoutList,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getPatientById } from "@/lib/doctor-utils"
import { getPatientMedicalRecordsForDoctor } from "@/lib/record-utils"
import AccessDeniedAnimation from "@/components/access-denied-animation"
// Import the PatientRecordModal and RecordNoteModal components
import { PatientRecordModal } from "@/components/patient-record-modal"
import { RecordNoteModal } from "@/components/record-note-modal"
import { getMedicalRecordById } from "@/lib/record-utils"

export default function PatientRecordsPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [patient, setPatient] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [viewMode, setViewMode] = useState("list") // 'list' or 'grid'
  const [hasAccess, setHasAccess] = useState(false)

  // Add state for modals
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [fullRecordData, setFullRecordData] = useState(null)
  const [loadingRecord, setLoadingRecord] = useState(false)

  // Get patient ID from URL
  const patientId = params.id

  // Load patient data and records
  useEffect(() => {
    if (!user || !patientId) return

    const loadData = async () => {
      setLoading(true)

      try {
        // Get patient data
        const patientData = await getPatientById(patientId)
        setPatient(patientData)

        // Set up listener for records that this doctor has access to
        const unsubscribe = getPatientMedicalRecordsForDoctor(user.uid, patientId, (recordsData) => {
          // Transform the data to match the expected format
          const formattedRecords = recordsData.map((record) => ({
            id: record.id,
            title: record.name,
            description: record.notes || "",
            type: record.type,
            fileType: record.fileType,
            fileSize: record.fileSize,
            createdAt: record.uploadedDate,
            sharedAt: new Date(), // This is an approximation
            thumbnail: record.thumbnail,
          }))

          setRecords(formattedRecords)
          setHasAccess(formattedRecords.length > 0)
          setLoading(false)
        })

        return () => {
          if (typeof unsubscribe === "function") {
            unsubscribe()
          }
        }
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [user, patientId])

  // Filter and sort records
  const filteredRecords = records
    .filter((record) => {
      // Filter by search term
      const matchesSearch =
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.type.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by type
      const matchesType = filterType === "all" || record.type === filterType

      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt)
      } else if (sortBy === "title") {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else if (sortBy === "type") {
        return sortOrder === "asc" ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)
      }
      return 0
    })

  // Update the handleViewRecord function
  const handleViewRecord = async (record) => {
    try {
      setLoadingRecord(true)

      // Get the full record data including file data
      const fullRecord = await getMedicalRecordById(record.id)
      setFullRecordData(fullRecord)
      setSelectedRecord(record)
      setShowRecordModal(true)
    } catch (error) {
      console.error("Error loading record:", error)
    } finally {
      setLoadingRecord(false)
    }
  }

  // Add a function to handle adding notes
  const handleAddNote = (record) => {
    setSelectedRecord(record)
    setShowNoteModal(true)
  }

  // Navigate back to patient details
  const handleBackToPatient = () => {
    router.push(`/doctor/patients/${patientId}`)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setSortBy("date")
    setSortOrder("desc")
  }

  // Toggle view mode between list and grid
  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list")
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Render record in list view
  const renderListRecord = (record, index) => {
    return (
      <div
        key={record.id}
        className="group cursor-pointer rounded-lg border border-pale-stone bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-soft-amber/30"
        style={{
          animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
          opacity: 0,
        }}
        onClick={() => handleViewRecord(record)}
      >
        <div className="flex items-start">
          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-soft-amber/10 text-soft-amber">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-graphite group-hover:text-soft-amber transition-colors">
                {record.title}
              </h3>
              <span className="rounded-full bg-pale-stone px-2 py-0.5 text-xs text-drift-gray">{record.type}</span>
            </div>
            <p className="mt-1 text-sm text-drift-gray line-clamp-2">{record.description}</p>
            <div className="mt-2 flex items-center text-xs text-drift-gray">
              <Calendar className="mr-1 h-3 w-3" />
              <span className="mr-3">Created: {formatDate(record.createdAt)}</span>
              {record.sharedAt && (
                <>
                  <Clock className="mr-1 h-3 w-3" />
                  <span>Shared: {formatDate(record.sharedAt)}</span>
                </>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddNote(record)
                }}
                className="ml-2 rounded-md border border-blue-300 bg-white px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render record in grid view
  const renderGridRecord = (record, index) => {
    return (
      <div
        key={record.id}
        className="group cursor-pointer rounded-lg border border-pale-stone bg-white shadow-sm transition-all hover:shadow-md hover:border-soft-amber/30"
        style={{
          animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
          opacity: 0,
        }}
        onClick={() => handleViewRecord(record)}
      >
        <div className="h-2 w-full bg-soft-amber/20"></div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-amber/10 text-soft-amber">
              <FileIcon className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-pale-stone px-2 py-0.5 text-xs text-drift-gray">{record.type}</span>
          </div>

          <h3 className="font-medium text-graphite group-hover:text-soft-amber transition-colors mb-2 line-clamp-1">
            {record.title}
          </h3>

          <p className="text-sm text-drift-gray line-clamp-3 mb-3">{record.description}</p>

          <div className="border-t border-pale-stone pt-2 flex flex-col gap-1">
            <div className="flex items-center text-xs text-drift-gray">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Created: {formatDate(record.createdAt)}</span>
            </div>
            {record.sharedAt && (
              <div className="flex items-center text-xs text-drift-gray">
                <Clock className="mr-1 h-3 w-3" />
                <span>Shared: {formatDate(record.sharedAt)}</span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleAddNote(record)
              }}
              className="mt-2 w-full rounded-md border border-blue-300 bg-white px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Add Note
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
          {/* Only show back button if we have access or are loading */}
          {(hasAccess || loading) && (
            <button
              onClick={handleBackToPatient}
              className="mb-4 inline-flex items-center rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/30"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Patient
            </button>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              {!loading && patient ? (
                <>
                  <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white md:text-3xl">Medical Records</h1>
                    <p className="mt-1 text-amber-50">{patient.displayName}'s shared medical records</p>
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
          </div>
        </div>
      </div>

      {loading ? (
        // Loading state
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber mb-4"></div>
            <p className="text-drift-gray">Loading medical records...</p>
          </div>
        </div>
      ) : !hasAccess ? (
        // Access denied state with enhanced animation - NO BUTTONS
        <div className="rounded-lg border border-pale-stone bg-white shadow-sm overflow-hidden">
          <div className="p-6">
            <AccessDeniedAnimation
              message={`You don't have access to ${patient?.displayName || "this patient"}'s medical records yet.`}
              patientName={patient?.displayName}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Search and filters */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
              <input
                type="text"
                placeholder="Search records by title or description..."
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
                {(filterType !== "all" || sortBy !== "date" || sortOrder !== "desc") && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-soft-amber text-xs text-white">
                    {(filterType !== "all" ? 1 : 0) + (sortBy !== "date" || sortOrder !== "desc" ? 1 : 0)}
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
                  <label htmlFor="filterType" className="text-sm font-medium text-graphite">
                    Record Type
                  </label>
                  <select
                    id="filterType"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  >
                    <option value="all">All Types</option>
                    <option value="lab">Lab Results</option>
                    <option value="imaging">Imaging</option>
                    <option value="prescription">Prescription</option>
                    <option value="note">Doctor's Note</option>
                    <option value="other">Other</option>
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
                    <option value="title">Title</option>
                    <option value="type">Type</option>
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

          {/* Records list */}
          {filteredRecords.length > 0 ? (
            viewMode === "list" ? (
              // List view
              <div className="space-y-4">{filteredRecords.map((record, index) => renderListRecord(record, index))}</div>
            ) : (
              // Grid view
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecords.map((record, index) => renderGridRecord(record, index))}
              </div>
            )
          ) : (
            <div className="rounded-lg border border-pale-stone bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pale-stone">
                <FileText className="h-8 w-8 text-drift-gray" />
              </div>
              <h3 className="mb-1 text-lg font-medium text-graphite">No Records Found</h3>
              <p className="mb-4 text-drift-gray">
                {searchTerm || filterType !== "all"
                  ? "No records match your search criteria. Try adjusting your filters."
                  : "This patient hasn't shared any medical records with you yet."}
              </p>
              <button
                onClick={handleBackToPatient}
                className="inline-flex items-center rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Patient Profile
              </button>
            </div>
          )}
        </>
      )}

      {/* Record View Modal */}
      <PatientRecordModal
        isOpen={showRecordModal}
        onClose={() => {
          setShowRecordModal(false)
          setFullRecordData(null)
        }}
        record={fullRecordData || selectedRecord}
        loading={loadingRecord}
        showDoctorNotes={true}
      />

      {/* Add Note Modal */}
      <RecordNoteModal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} record={selectedRecord} />

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
=======
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Download, Eye, FileText, Search } from "lucide-react"
import Link from "next/link"
import { PatientRecordModal } from "@/components/patient-record-modal"

export default function PatientRecordsPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)

  // Mock patient data
  const patient = {
    id: patientId,
    name: "John Smith",
    age: 45,
    dob: "1978-05-15",
    gender: "Male",
    phone: "(555) 123-4567",
    email: "john.smith@example.com",
    address: "123 Main St, Anytown, CA 12345",
  }

  // Mock records data
  const allRecords = [
    {
      id: 1,
      type: "Lab Result",
      title: "Complete Blood Count",
      date: "2023-05-10",
      provider: "Dr. Sarah Johnson",
      summary: "Normal blood count results. All values within reference range.",
      content: {
        hemoglobin: "14.2 g/dL",
        whiteBloodCells: "7.5 x 10^9/L",
        platelets: "250 x 10^9/L",
        hematocrit: "42%",
        notes: "Patient's blood count is normal with no signs of infection or anemia.",
      },
    },
    {
      id: 2,
      type: "Imaging",
      title: "Chest X-Ray",
      date: "2023-04-22",
      provider: "Dr. Michael Chen",
      summary: "Clear lung fields. No abnormalities detected.",
      content: {
        findings: "Clear lung fields bilaterally. Heart size normal. No pleural effusion.",
        impression: "Normal chest X-ray. No acute cardiopulmonary process.",
        recommendations: "No follow-up imaging needed at this time.",
      },
    },
    {
      id: 3,
      type: "Visit Note",
      title: "Annual Physical",
      date: "2023-03-15",
      provider: "Dr. Sarah Johnson",
      summary: "Routine annual physical. Patient in good health.",
      content: {
        vitalSigns: {
          bloodPressure: "120/80 mmHg",
          heartRate: "72 bpm",
          respiratoryRate: "16 breaths/min",
          temperature: "98.6°F",
          oxygenSaturation: "98%",
        },
        assessment: "Patient is in good health. Maintaining healthy diet and exercise routine.",
        plan: "Continue current medications. Return for follow-up in one year.",
      },
    },
    {
      id: 4,
      type: "Prescription",
      title: "Lisinopril Renewal",
      date: "2023-03-15",
      provider: "Dr. Sarah Johnson",
      summary: "Renewal of blood pressure medication.",
      content: {
        medication: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "90 days",
        refills: "3",
        instructions: "Take with or without food at the same time each day.",
      },
    },
    {
      id: 5,
      type: "Lab Result",
      title: "Lipid Panel",
      date: "2023-03-15",
      provider: "Dr. Sarah Johnson",
      summary: "Cholesterol levels slightly elevated.",
      content: {
        totalCholesterol: "210 mg/dL (High)",
        ldl: "130 mg/dL (Borderline High)",
        hdl: "45 mg/dL (Normal)",
        triglycerides: "150 mg/dL (Normal)",
        notes: "Recommend dietary changes and increased exercise. Recheck in 6 months.",
      },
    },
    {
      id: 6,
      type: "Visit Note",
      title: "Follow-up Visit",
      date: "2022-11-10",
      provider: "Dr. Sarah Johnson",
      summary: "Follow-up for hypertension management.",
      content: {
        vitalSigns: {
          bloodPressure: "135/85 mmHg",
          heartRate: "75 bpm",
          respiratoryRate: "16 breaths/min",
          temperature: "98.4°F",
        },
        assessment: "Hypertension, controlled. Patient reports compliance with medication.",
        plan: "Continue Lisinopril 10mg daily. Encourage low-sodium diet and regular exercise.",
      },
    },
  ]

  // Filter records based on search term and type
  const filteredRecords = allRecords.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.summary.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || record.type === filterType

    return matchesSearch && matchesType
  })

  // Group records by year and month
  const groupedRecords = filteredRecords.reduce((groups, record) => {
    const date = new Date(record.date)
    const year = date.getFullYear()
    const month = date.getMonth()

    if (!groups[year]) {
      groups[year] = {}
    }

    if (!groups[year][month]) {
      groups[year][month] = []
    }

    groups[year][month].push(record)
    return groups
  }, {})

  // Sort years and months in descending order
  const sortedYears = Object.keys(groupedRecords)
    .map(Number)
    .sort((a, b) => b - a)

  // Get month name
  const getMonthName = (month) => {
    return new Date(0, month).toLocaleString("default", { month: "long" })
  }

  // Handle view record
  const handleViewRecord = (record) => {
    setSelectedRecord(record)
    setIsRecordModalOpen(true)
  }

  // Handle download record
  const handleDownloadRecord = (record) => {
    // In a real app, this would generate and download a PDF or other file format
    alert(`Downloading record: ${record.title}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 rounded-full p-2 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-graphite">Medical Records</h1>
          <p className="text-drift-gray">
            <Link href={`/doctor/patients/${patientId}`} className="hover:text-soft-amber hover:underline">
              {patient.name}
            </Link>{" "}
            • {patient.age} years old
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
          />
        </div>
        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-md border border-earth-beige bg-white py-2 pl-3 pr-10 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
          >
            <option value="all">All Types</option>
            <option value="Lab Result">Lab Results</option>
            <option value="Imaging">Imaging</option>
            <option value="Visit Note">Visit Notes</option>
            <option value="Prescription">Prescriptions</option>
          </select>
        </div>
      </div>

      {filteredRecords.length > 0 ? (
        <div className="space-y-8">
          {sortedYears.map((year) => (
            <div key={year} className="space-y-6">
              <h2 className="text-xl font-semibold text-graphite">{year}</h2>
              {Object.keys(groupedRecords[year])
                .map(Number)
                .sort((a, b) => b - a)
                .map((month) => (
                  <div key={`${year}-${month}`} className="space-y-4">
                    <h3 className="text-lg font-medium text-graphite">{getMonthName(month)}</h3>
                    <div className="space-y-3">
                      {groupedRecords[year][month].map((record) => (
                        <div
                          key={record.id}
                          className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm transition-colors hover:border-soft-amber/30"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-3 sm:mb-0">
                              <div className="flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-soft-amber" />
                                <h4 className="font-medium text-graphite">{record.title}</h4>
                              </div>
                              <p className="text-sm text-drift-gray">{record.type}</p>
                              <p className="text-sm text-drift-gray">{record.summary}</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                                <Calendar className="mr-2 h-4 w-4 text-soft-amber" />
                                <span className="text-sm text-graphite">
                                  {new Date(record.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              onClick={() => handleViewRecord(record)}
                              className="rounded-md border border-earth-beige bg-white px-3 py-1 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone"
                            >
                              <Eye className="mr-1 inline-block h-4 w-4" />
                              View
                            </button>
                            <button
                              onClick={() => handleDownloadRecord(record)}
                              className="rounded-md bg-soft-amber px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                            >
                              <Download className="mr-1 inline-block h-4 w-4" />
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-pale-stone bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pale-stone">
            <FileText className="h-8 w-8 text-drift-gray" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-graphite">No Records Found</h3>
          <p className="mb-4 text-drift-gray">
            {searchTerm || filterType !== "all"
              ? "No records match your search criteria. Try adjusting your filters."
              : "This patient doesn't have any medical records yet."}
          </p>
        </div>
      )}

      {/* Record Modal */}
      <PatientRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        record={selectedRecord}
      />
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    </div>
  )
}
