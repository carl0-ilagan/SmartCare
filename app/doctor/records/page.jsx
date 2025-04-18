"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Download, File, FileText, Search, User, Filter, Eye } from "lucide-react"
import { PatientRecordModal } from "@/components/patient-record-modal"

export default function DoctorRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showRecordModal, setShowRecordModal] = useState(false)

  // Mock patients data
  const patients = [
    { id: 1, name: "John Smith", age: 45 },
    { id: 2, name: "Emily Johnson", age: 32 },
    { id: 3, name: "Michael Brown", age: 58 },
    { id: 4, name: "Sarah Davis", age: 27 },
    { id: 5, name: "Robert Wilson", age: 62 },
  ]

  // Mock medical records data
  const medicalRecords = [
    {
      id: 1,
      patientId: 1,
      patientName: "John Smith",
      name: "Blood Test Results",
      type: "Lab Report",
      date: "2023-05-01",
      fileSize: "1.2 MB",
      uploadedDate: "2023-05-02",
      notes: "Routine annual blood work including CBC, lipid panel, and metabolic panel.",
      preview: "/placeholder.svg?height=800&width=600",
    },
    {
      id: 2,
      patientId: 1,
      patientName: "John Smith",
      name: "Chest X-Ray",
      type: "Imaging",
      date: "2023-04-15",
      fileSize: "3.5 MB",
      uploadedDate: "2023-04-16",
      notes: "Follow-up chest X-ray to monitor previous lung condition.",
      preview: "/placeholder.svg?height=800&width=600",
    },
    {
      id: 3,
      patientId: 1,
      patientName: "John Smith",
      name: "Vaccination Record",
      type: "Immunization",
      date: "2023-03-10",
      fileSize: "0.8 MB",
      uploadedDate: "2023-03-10",
      notes: "COVID-19 vaccination record showing completed primary series and booster.",
      preview: "/placeholder.svg?height=800&width=600",
    },
    {
      id: 4,
      patientId: 2,
      patientName: "Emily Johnson",
      name: "MRI Results",
      type: "Imaging",
      date: "2023-05-10",
      fileSize: "5.7 MB",
      uploadedDate: "2023-05-11",
      notes: "Brain MRI to investigate recurring headaches.",
      preview: "/placeholder.svg?height=800&width=600",
    },
    {
      id: 5,
      patientId: 2,
      patientName: "Emily Johnson",
      name: "Allergy Test Results",
      type: "Lab Report",
      date: "2023-04-22",
      fileSize: "1.5 MB",
      uploadedDate: "2023-04-23",
      notes: "Comprehensive allergy panel testing for environmental and food allergies.",
      preview: "/placeholder.svg?height=800&width=600",
    },
    {
      id: 6,
      patientId: 3,
      patientName: "Michael Brown",
      name: "Echocardiogram Report",
      type: "Imaging",
      date: "2023-05-15",
      fileSize: "4.2 MB",
      uploadedDate: "2023-05-16",
      notes: "Routine echocardiogram to monitor heart function.",
      preview: "/placeholder.svg?height=800&width=600",
    },
    {
      id: 7,
      patientId: 4,
      patientName: "Sarah Davis",
      name: "Pregnancy Ultrasound",
      type: "Imaging",
      date: "2023-06-01",
      fileSize: "3.8 MB",
      uploadedDate: "2023-06-01",
      notes: "20-week anatomy scan showing normal fetal development.",
      preview: "/placeholder.svg?height=800&width=600",
    },
    {
      id: 8,
      patientId: 5,
      patientName: "Robert Wilson",
      name: "Colonoscopy Report",
      type: "Procedure",
      date: "2023-04-05",
      fileSize: "2.1 MB",
      uploadedDate: "2023-04-06",
      notes: "Routine screening colonoscopy with polyp removal.",
      preview: "/placeholder.svg?height=800&width=600",
    },
  ]

  // Get unique record types for filter
  const recordTypes = [...new Set(medicalRecords.map((record) => record.type))]

  // Filter records based on search, patient, and type
  const filteredRecords = medicalRecords
    .filter((record) => {
      // Filter by search term
      const matchesSearch =
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.type.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by patient
      const matchesPatient = selectedPatient === "all" || record.patientId.toString() === selectedPatient

      // Filter by type
      const matchesType = filterType === "all" || record.type === filterType

      return matchesSearch && matchesPatient && matchesType
    })
    .sort((a, b) => new Date(b.uploadedDate) - new Date(a.uploadedDate))

  // Handle viewing a record
  const handleViewRecord = (record) => {
    setSelectedRecord(record)
    setShowRecordModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite md:text-3xl">Patient Records</h1>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
          <input
            type="text"
            placeholder="Search records by name, patient, or type..."
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
              <label htmlFor="filterPatient" className="block text-sm font-medium text-graphite">
                Patient
              </label>
              <select
                id="filterPatient"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
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
            <div>
              <label htmlFor="filterType" className="block text-sm font-medium text-graphite">
                Record Type
              </label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="mt-1 rounded-md border border-earth-beige bg-white py-1 pl-3 pr-10 text-sm text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              >
                <option value="all">All Types</option>
                {recordTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {filteredRecords.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-pale-stone bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pale-stone bg-pale-stone text-left text-sm font-medium text-graphite">
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Record Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Uploaded</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-pale-stone hover:bg-pale-stone/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-drift-gray" />
                      <span className="font-medium text-graphite">{record.patientName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <File className="mr-2 h-5 w-5 text-soft-amber" />
                      <span className="text-graphite">{record.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-drift-gray">{record.type}</td>
                  <td className="px-4 py-3 text-drift-gray">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-drift-gray">{record.fileSize}</td>
                  <td className="px-4 py-3 text-drift-gray">{new Date(record.uploadedDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewRecord(record)}
                        className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                        title="View Record"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </button>
                      <button
                        className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                        title="Download Record"
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
      ) : (
        <div className="rounded-lg border border-pale-stone bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pale-stone">
            <FileText className="h-8 w-8 text-drift-gray" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-graphite">No Records Found</h3>
          <p className="mb-4 text-drift-gray">
            {searchTerm || selectedPatient !== "all" || filterType !== "all"
              ? "No records match your search criteria. Try adjusting your filters."
              : "There are no patient records available at this time."}
          </p>
        </div>
      )}

      {/* Record View Modal */}
      <PatientRecordModal isOpen={showRecordModal} onClose={() => setShowRecordModal(false)} record={selectedRecord} />
    </div>
  )
}
