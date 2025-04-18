"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, FileText, User, Clock, Pill } from "lucide-react"
import Link from "next/link"
import { PrescriptionSuccessModal } from "@/components/prescription-success-modal"

export default function NewPrescriptionPage() {
  const [patient, setPatient] = useState("")
  const [medication, setMedication] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("")
  const [duration, setDuration] = useState("")
  const [instructions, setInstructions] = useState("")
  const [startDate, setStartDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Mock patients data
  const patients = [
    { id: 1, name: "John Smith", age: 45 },
    { id: 2, name: "Emily Johnson", age: 32 },
    { id: 3, name: "Michael Brown", age: 58 },
    { id: 4, name: "Sarah Davis", age: 27 },
    { id: 5, name: "Robert Wilson", age: 62 },
  ]

  // Mock medications
  const medications = [
    "Amoxicillin",
    "Lisinopril",
    "Atorvastatin",
    "Levothyroxine",
    "Metformin",
    "Amlodipine",
    "Metoprolol",
    "Omeprazole",
    "Albuterol",
    "Gabapentin",
  ]

  // Frequency options
  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "Weekly",
  ]

  // Duration options
  const durationOptions = [
    "3 days",
    "5 days",
    "7 days",
    "10 days",
    "14 days",
    "30 days",
    "60 days",
    "90 days",
    "6 months",
    "1 year",
    "Indefinite",
  ]

  // Get today's date for min date attribute
  const today = new Date().toISOString().split("T")[0]

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccessModal(true)
    }, 1000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center">
        <Link
          href="/doctor/prescriptions"
          className="mr-4 rounded-full p-2 text-drift-gray hover:bg-pale-stone hover:text-soft-amber transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to Prescriptions</span>
        </Link>
        <h1 className="text-2xl font-bold text-graphite">New Prescription</h1>
      </div>

      <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="patient" className="block text-sm font-medium text-graphite mb-1">
                Patient
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                <select
                  id="patient"
                  value={patient}
                  onChange={(e) => setPatient(e.target.value)}
                  required
                  className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                >
                  <option value="">Select a patient</option>
                  {patients.map((pat) => (
                    <option key={pat.id} value={pat.id}>
                      {pat.name} - Age: {pat.age}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="medication" className="block text-sm font-medium text-graphite mb-1">
                Medication
              </label>
              <div className="relative">
                <Pill className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                <select
                  id="medication"
                  value={medication}
                  onChange={(e) => setMedication(e.target.value)}
                  required
                  className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                >
                  <option value="">Select a medication</option>
                  {medications.map((med) => (
                    <option key={med} value={med}>
                      {med}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-graphite mb-1">
                  Dosage
                </label>
                <input
                  id="dosage"
                  type="text"
                  placeholder="e.g., 500mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  required
                  className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                />
              </div>

              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-graphite mb-1">
                  Frequency
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                  <select
                    id="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    required
                    className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  >
                    <option value="">Select frequency</option>
                    {frequencyOptions.map((freq) => (
                      <option key={freq} value={freq}>
                        {freq}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-graphite mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                  <input
                    id="startDate"
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-graphite mb-1">
                  Duration
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                  <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  >
                    <option value="">Select duration</option>
                    {durationOptions.map((dur) => (
                      <option key={dur} value={dur}>
                        {dur}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-graphite mb-1">
                Special Instructions
              </label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Any special instructions for taking this medication"
                rows={4}
                className="w-full rounded-md border border-earth-beige bg-white py-2 px-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Link
              href="/doctor/prescriptions"
              className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? "Creating..." : "Create Prescription"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <PrescriptionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          // Reset form
          setPatient("")
          setMedication("")
          setDosage("")
          setFrequency("")
          setDuration("")
          setInstructions("")
          setStartDate("")
        }}
        message="Prescription created successfully!"
      />
    </div>
  )
}
