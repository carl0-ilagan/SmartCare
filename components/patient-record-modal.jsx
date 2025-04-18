"use client"

import { useState, useEffect } from "react"
import { Calendar, Download, File, User, X } from "lucide-react"

export function PatientRecordModal({ isOpen, onClose, record }) {
  const [isVisible, setIsVisible] = useState(false)

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle closing with animation
  const handleClose = () => {
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

  return (
    <>
      {/* Backdrop with animation */}
      <div
        id="record-backdrop"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.3s ease-in-out" }}
      />

      {/* Modal with animation */}
      <div
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
    </>
  )
}
