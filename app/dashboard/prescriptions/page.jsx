"use client"

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

  // Handle prescription view
  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription)
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

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
          <input
            type="text"
            placeholder="Search by doctor, medication, or notes..."
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
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      )}

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

      {/* Success Notification */}
      <SuccessNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </div>
  )
}
