"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Download, File, FileText, Search, Trash2, Upload, User, X } from "lucide-react"

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState("history")
  const [searchTerm, setSearchTerm] = useState("")
  const [uploadingFile, setUploadingFile] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [recordName, setRecordName] = useState("")
  const [recordType, setRecordType] = useState("")
  const [recordDate, setRecordDate] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Mock appointment history data
  const appointmentHistory = [
    {
      id: 3,
      doctor: "Dr. Emily Rodriguez",
      specialty: "Neurologist",
      date: "2023-05-10",
      time: "11:15 AM",
      type: "Initial Visit",
      status: "completed",
      notes: "Headache assessment",
      summary: {
        diagnosis: "Tension headaches",
        recommendations: "Over-the-counter pain relievers, stress management techniques",
        prescriptions: ["Ibuprofen 400mg as needed"],
        followUp: "In 4 weeks if symptoms persist",
      },
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
      summary: {
        diagnosis: "Healthy, no concerns",
        recommendations: "Continue regular exercise and balanced diet",
        prescriptions: [],
        followUp: "Annual check-up next year",
      },
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
      summary: {
        diagnosis: "Controlled hypertension",
        recommendations: "Continue current medication regimen, low sodium diet",
        prescriptions: ["Lisinopril 10mg daily"],
        followUp: "In 3 months",
      },
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
  ]

  // Mock medical records data
  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      name: "Blood Test Results",
      type: "Lab Report",
      date: "2023-05-01",
      fileSize: "1.2 MB",
      uploadedDate: "2023-05-02",
    },
    {
      id: 2,
      name: "Chest X-Ray",
      type: "Imaging",
      date: "2023-04-15",
      fileSize: "3.5 MB",
      uploadedDate: "2023-04-16",
    },
    {
      id: 3,
      name: "Vaccination Record",
      type: "Immunization",
      date: "2023-03-10",
      fileSize: "0.8 MB",
      uploadedDate: "2023-03-10",
    },
  ])

  // Filter appointment history
  const filteredHistory = appointmentHistory
    .filter(
      (appointment) =>
        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  // Filter medical records
  const filteredRecords = medicalRecords
    .filter(
      (record) =>
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.type.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Handle file upload
  const handleUpload = (e) => {
    e.preventDefault()

    if (!selectedFile || !recordName || !recordType || !recordDate) return

    setUploadingFile(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)

        // Add new record
        const newRecord = {
          id: medicalRecords.length + 1,
          name: recordName,
          type: recordType,
          date: recordDate,
          fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedDate: new Date().toISOString().split("T")[0],
        }

        setMedicalRecords([...medicalRecords, newRecord])

        // Reset form
        setSelectedFile(null)
        setRecordName("")
        setRecordType("")
        setRecordDate("")
        setUploadProgress(0)
        setUploadingFile(false)
        setShowUploadModal(false)
      }
    }, 300)
  }

  // Handle record deletion
  const handleDeleteRecord = (id) => {
    setMedicalRecords(medicalRecords.filter((record) => record.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite md:text-3xl">Medical Records</h1>
        {activeTab === "records" && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Record
          </button>
        )}
      </div>

      {/* Tab Navigation - Enhanced for mobile */}
      {isMobile ? (
        <div className="flex rounded-lg bg-pale-stone p-1.5">
          <button
            onClick={() => setActiveTab("history")}
            className={`relative flex-1 rounded-md py-2.5 text-center text-sm font-medium transition-all duration-300 ${
              activeTab === "history" ? "bg-white text-soft-amber shadow-sm" : "text-drift-gray"
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab("records")}
            className={`relative flex-1 rounded-md py-2.5 text-center text-sm font-medium transition-all duration-300 ${
              activeTab === "records" ? "bg-white text-soft-amber shadow-sm" : "text-drift-gray"
            }`}
          >
            Records
          </button>
        </div>
      ) : (
        <div className="border-b border-earth-beige">
          <div className="relative flex">
            <button
              onClick={() => setActiveTab("history")}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "history" ? "text-soft-amber" : "text-drift-gray hover:text-soft-amber"
              }`}
            >
              Appointment History
              {activeTab === "history" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-soft-amber"></div>}
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "records" ? "text-soft-amber" : "text-drift-gray hover:text-soft-amber"
              }`}
            >
              Medical Records
              {activeTab === "records" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-soft-amber"></div>}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
        <input
          type="text"
          placeholder={activeTab === "history" ? "Search appointments..." : "Search records..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
        />
      </div>

      {/* Appointment History Tab */}
      <div
        className={`space-y-4 transition-opacity duration-300 ease-in-out ${
          activeTab === "history" ? "opacity-100 tab-content-enter" : "hidden opacity-0"
        }`}
      >
        {filteredHistory.length > 0 ? (
          filteredHistory.map((appointment) => (
            <div
              key={appointment.id}
              className={`rounded-lg border border-pale-stone bg-white p-4 shadow-sm ${
                appointment.status === "cancelled" ? "opacity-70" : ""
              }`}
            >
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
                    <span className="text-sm text-graphite">{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                    <Clock className="mr-2 h-4 w-4 text-soft-amber" />
                    <span className="text-sm text-graphite">{appointment.time}</span>
                  </div>
                  <div className="flex items-center rounded-md bg-pale-stone px-3 py-1">
                    <span className="text-sm text-graphite">{appointment.type}</span>
                  </div>
                  {appointment.status === "cancelled" && (
                    <div className="flex items-center rounded-md bg-red-100 px-3 py-1">
                      <X className="mr-2 h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-500">Cancelled</span>
                    </div>
                  )}
                </div>
              </div>

              {appointment.summary && (
                <div className="mt-4 rounded-md bg-pale-stone/50 p-3">
                  <div className="mb-2">
                    <span className="font-medium text-graphite">Diagnosis:</span>{" "}
                    <span className="text-drift-gray">{appointment.summary.diagnosis}</span>
                  </div>
                  {appointment.summary.prescriptions.length > 0 && (
                    <div className="mb-2">
                      <span className="font-medium text-graphite">Prescriptions:</span>{" "}
                      <span className="text-drift-gray">{appointment.summary.prescriptions.join(", ")}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-graphite">Follow-up:</span>{" "}
                    <span className="text-drift-gray">{appointment.summary.followUp}</span>
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button className="rounded-md bg-soft-amber px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-amber-600">
                  <FileText className="mr-1 h-4 w-4 inline" />
                  Download Summary
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-pale-stone bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pale-stone">
              <Calendar className="h-8 w-8 text-drift-gray" />
            </div>
            <h3 className="mb-1 text-lg font-medium text-graphite">No Appointment History</h3>
            <p className="mb-4 text-drift-gray">
              {searchTerm
                ? "No appointments match your search criteria."
                : "You don't have any past appointments in your record."}
            </p>
          </div>
        )}
      </div>

      {/* Medical Records Tab */}
      <div
        className={`space-y-4 transition-opacity duration-300 ease-in-out ${
          activeTab === "records" ? "opacity-100 tab-content-enter" : "hidden opacity-0"
        }`}
      >
        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-pale-stone bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-pale-stone bg-pale-stone text-left text-sm font-medium text-graphite">
                  <th className="px-4 py-3">Record Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-pale-stone hover:bg-pale-stone/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <File className="mr-2 h-5 w-5 text-soft-amber" />
                        <span className="font-medium text-graphite">{record.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-drift-gray">{record.type}</td>
                    <td className="px-4 py-3 text-drift-gray">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-drift-gray">{record.fileSize}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                          title="Download Record"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-red-500"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
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
            <h3 className="mb-1 text-lg font-medium text-graphite">No Medical Records</h3>
            <p className="mb-4 text-drift-gray">
              {searchTerm ? "No records match your search criteria." : "You haven't uploaded any medical records yet."}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
            >
              <Upload className="mr-2 h-4 w-4 inline" />
              Upload Your First Record
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal with Animation */}
      {showUploadModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ease-in-out"
            onClick={() => !uploadingFile && setShowUploadModal(false)}
            style={{ animation: "fadeIn 0.3s ease-in-out" }}
          />
          <div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
            style={{ animation: "scaleIn 0.3s ease-in-out" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-graphite">Upload Medical Record</h2>
              {!uploadingFile && (
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
              )}
            </div>

            <form onSubmit={handleUpload} className="mt-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="recordName" className="text-sm font-medium text-graphite">
                  Record Name
                </label>
                <input
                  id="recordName"
                  type="text"
                  value={recordName}
                  onChange={(e) => setRecordName(e.target.value)}
                  placeholder="e.g., Blood Test Results"
                  required
                  disabled={uploadingFile}
                  className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber disabled:bg-pale-stone"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="recordType" className="text-sm font-medium text-graphite">
                  Record Type
                </label>
                <select
                  id="recordType"
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  required
                  disabled={uploadingFile}
                  className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber disabled:bg-pale-stone"
                >
                  <option value="">Select record type</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Imaging">Imaging</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Immunization">Immunization</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="recordDate" className="text-sm font-medium text-graphite">
                  Record Date
                </label>
                <input
                  id="recordDate"
                  type="date"
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  required
                  disabled={uploadingFile}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber disabled:bg-pale-stone"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="recordFile" className="text-sm font-medium text-graphite">
                  File
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="recordFile"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedFile ? "border-soft-amber bg-soft-amber/5" : "border-earth-beige hover:bg-pale-stone"
                    } ${uploadingFile ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {selectedFile ? (
                        <>
                          <FileText className="w-8 h-8 mb-2 text-soft-amber" />
                          <p className="mb-1 text-sm text-graphite font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-drift-gray">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2 text-drift-gray" />
                          <p className="mb-1 text-sm text-graphite">
                            <span className="font-medium">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-drift-gray">PDF, JPG, PNG (MAX. 10MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      id="recordFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      disabled={uploadingFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {uploadingFile && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-drift-gray">Uploading...</span>
                    <span className="text-soft-amber font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-pale-stone rounded-full h-2">
                    <div
                      className="bg-soft-amber h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploadingFile}
                  className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingFile || !selectedFile || !recordName || !recordType || !recordDate}
                  className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2 disabled:opacity-50"
                >
                  {uploadingFile ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
