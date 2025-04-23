"use client"

import { useState, useEffect } from "react"
<<<<<<< HEAD
import {
  X,
  Download,
  FileText,
  AlertCircle,
  Calendar,
  Clock,
  Tag,
  FileImage,
  FileIcon as FilePdf,
  FileSpreadsheet,
  MessageSquare,
} from "lucide-react"
import { DoctorNotesModal } from "./doctor-notes-modal"

export function PatientRecordModal({ isOpen, onClose, record, loading, showDoctorNotes = false }) {
  const [error, setError] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
=======
import { Calendar, Download, File, User, X } from "lucide-react"

export function PatientRecordModal({ isOpen, onClose, record }) {
  const [isVisible, setIsVisible] = useState(false)
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
<<<<<<< HEAD
      setIsClosing(false)
=======
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      return () => clearTimeout(timer)
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    }
  }, [isOpen])

  // Handle closing with animation
  const handleClose = () => {
<<<<<<< HEAD
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsVisible(false)
    }, 300)
  }

  // Handle download
  const handleDownload = () => {
    try {
      if (!record || !record.fileData) {
        setError("File data not available for download.")
        return
      }

      // Create a link element
      const link = document.createElement("a")
      link.href = record.fileData
      link.download = record.name || "medical-record"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading file:", error)
      setError("Failed to download file. Please try again.")
    }
  }

  // Get file type display name
  const getFileTypeDisplay = (fileType) => {
    if (!fileType) return "Unknown"
    if (fileType.startsWith("image/")) return `Image (${fileType.split("/")[1].toUpperCase()})`
    if (fileType === "application/pdf") return "PDF Document"
    if (fileType.includes("word")) return "Word Document"
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "Spreadsheet"
    return fileType
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown"
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    if (!fileType) return <FileText className="h-16 w-16 text-gray-400" />
    if (fileType.startsWith("image/")) return <FileImage className="h-16 w-16 text-amber-500" />
    if (fileType === "application/pdf") return <FilePdf className="h-16 w-16 text-red-500" />
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return <FileSpreadsheet className="h-16 w-16 text-green-600" />
    return <FileText className="h-16 w-16 text-blue-500" />
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleString()
  }

  // Open doctor notes modal
  const openDoctorNotes = () => {
    setShowNotesModal(true)
  }

  if (!isOpen && !isVisible) return null
=======
    const backdrop = document.getElementById("record-backdrop")
    const modalContent = document.getElementById("record-content")

    if (backdrop) backdrop.style.animation = "fadeOut 0.3s ease-in-out forwards"
    if (modalContent) modalContent.style.animation = "scaleOut 0.3s ease-in-out forwards"

    setTimeout(() => {
      onClose()
    }, 280)
  }

  if (!isOpen && !isVisible) return null
  if (!record) return null
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

  return (
    <>
      {/* Backdrop with animation */}
      <div
<<<<<<< HEAD
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isClosing ? "opacity-0" : ""}`}
        onClick={handleClose}
=======
        id="record-backdrop"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.3s ease-in-out" }}
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
      />

      {/* Modal with animation */}
      <div
<<<<<<< HEAD
        className={`fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } ${isClosing ? "opacity-0 scale-95" : ""}`}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-amber-500 transition-colors duration-200"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <h2 className="mb-4 text-xl font-bold text-gray-800">Medical Record</h2>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-amber-500 mb-4"></div>
          </div>
        ) : error ? (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700">
            <div className="flex">
              <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        ) : record ? (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-800">{record.name}</h3>
                <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Type:</span>
                    <span className="ml-auto text-sm text-gray-500">{record.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Date:</span>
                    <span className="ml-auto text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">File Type:</span>
                    <span className="ml-auto text-sm text-gray-500">{getFileTypeDisplay(record.fileType)}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">File Size:</span>
                    <span className="ml-auto text-sm text-gray-500">{formatFileSize(record.fileSize)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Uploaded:</span>
                    <span className="ml-auto text-sm text-gray-500">
                      {new Date(record.uploadedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {record.notes && (
                  <div className="mt-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">Notes:</h4>
                    <p className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                      {record.notes}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Record
                  </button>

                  {showDoctorNotes && record.doctorNotes && record.doctorNotes.length > 0 && (
                    <button
                      onClick={openDoctorNotes}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                    >
                      <MessageSquare className="mr-2 h-4 w-4 text-amber-500" />
                      View Doctor Notes ({record.doctorNotes.length})
                    </button>
                  )}
                </div>
              </div>

              <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-4">
                {record.fileData ? (
                  record.fileType?.startsWith("image/") ? (
                    <img
                      src={record.fileData || "/placeholder.svg"}
                      alt={record.name}
                      className="max-h-[500px] max-w-full rounded-lg object-contain"
                    />
                  ) : record.fileType === "application/pdf" ? (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                      <FilePdf className="mb-2 h-16 w-16 text-red-500" />
                      <p className="text-center text-gray-500">
                        PDF document preview not available. Please download to view.
                      </p>
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                      {getFileIcon(record.fileType)}
                      <p className="text-center text-gray-500 mt-2">
                        Preview not available for this file type. Please download to view.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <FileText className="mb-2 h-16 w-16 text-gray-400" />
                    <p className="text-center text-gray-500">No preview available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-500">Record not found</p>
          </div>
        )}
      </div>

      {/* Doctor Notes Modal */}
      <DoctorNotesModal isOpen={showNotesModal} onClose={() => setShowNotesModal(false)} record={record} />
=======
        id="record-content"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
        style={{ animation: "scaleIn 0.3s ease-in-out" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-graphite">Medical Record Details</h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber transition-colors duration-200"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-lg bg-pale-stone p-4">
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5 text-soft-amber" />
                <h3 className="font-medium text-graphite">{record.patientName}</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <File className="mr-2 h-5 w-5 text-soft-amber" />
                <div>
                  <p className="text-sm font-medium text-graphite">Record Name</p>
                  <p className="text-sm text-drift-gray">{record.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="mr-2 h-5 w-5 text-soft-amber" />
                <div>
                  <p className="text-sm font-medium text-graphite">Record Date</p>
                  <p className="text-sm text-drift-gray">{new Date(record.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-2 h-5 w-5 flex items-center justify-center">
                  <span className="text-soft-amber font-bold">T</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-graphite">Record Type</p>
                  <p className="text-sm text-drift-gray">{record.type}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="mr-2 h-5 w-5 text-soft-amber" />
                <div>
                  <p className="text-sm font-medium text-graphite">Upload Date</p>
                  <p className="text-sm text-drift-gray">{new Date(record.uploadedDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-2 h-5 w-5 flex items-center justify-center">
                  <span className="text-soft-amber font-bold">S</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-graphite">File Size</p>
                  <p className="text-sm text-drift-gray">{record.fileSize}</p>
                </div>
              </div>
            </div>

            {record.notes && (
              <div className="rounded-md border border-pale-stone p-4">
                <p className="text-sm font-medium text-graphite">Notes</p>
                <p className="text-sm text-drift-gray">{record.notes}</p>
              </div>
            )}

            <div className="pt-2">
              <button className="inline-flex items-center rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2">
                <Download className="mr-2 h-4 w-4" />
                Download Record
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-pale-stone bg-white p-2">
            <div className="flex h-full items-center justify-center">
              <img
                src={record.preview || "/placeholder.svg"}
                alt={record.name}
                className="max-h-[500px] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    </>
  )
}
