"use client"

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
    </div>
  )
}
