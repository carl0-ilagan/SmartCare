"use client"

import { useState, useEffect } from "react"
<<<<<<< HEAD
import { useRouter, useParams } from "next/navigation"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  FileText,
  MessageSquare,
  ArrowLeft,
  AlertCircle,
  Stethoscope,
  Activity,
  Pill,
  ChevronRight,
  CalendarDays,
  MessageCircle,
  FileIcon,
  Shield,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getPatientById, getPatientInteractions } from "@/lib/doctor-utils"
// Import the AppointmentHistory component
import { AppointmentHistory } from "@/components/appointment-history"

export default function PatientDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [patient, setPatient] = useState(null)
  const [interactions, setInteractions] = useState({
    appointments: 0,
    messages: 0,
    records: 0,
    lastInteraction: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  // Add state for activeTab
  const [activeTab, setActiveTab] = useState("profile") // "profile" or "appointments"

  // Get patient ID from URL
  const patientId = params.id

  // Load patient data
  useEffect(() => {
    if (!user || !patientId) return

    // Update the loadPatient function to properly handle the phone number
    const loadPatient = async () => {
      setLoading(true)
      setError("")

      try {
        // Get patient data
        const patientData = await getPatientById(patientId)

        if (!patientData) {
          setError("Patient not found.")
          setLoading(false)
          return
        }

        // Log the patient data to verify we're getting the phone number
        console.log("Patient data:", patientData)

        setPatient(patientData)

        // Get interaction data
        const interactionData = await getPatientInteractions(user.uid, patientId)
        setInteractions(interactionData)

        setLoading(false)
      } catch (error) {
        console.error("Error loading patient:", error)
        setError("Failed to load patient information. Please try again.")
        setLoading(false)
      }
    }

    loadPatient()
  }, [user, patientId])

  // Navigate to appointments page
  const handleViewAppointments = () => {
    router.push(`/doctor/patients/${patientId}/appointments`)
  }

  // Navigate to messages page
  const handleViewMessages = () => {
    router.push(`/doctor/chat?patientId=${patientId}`)
  }

  // Navigate to records page
  const handleViewRecords = () => {
    router.push(`/doctor/patients/${patientId}/records`)
  }

  // Navigate to prescriptions page
  const handleViewPrescriptions = () => {
    router.push(`/doctor/patients/${patientId}/prescriptions`)
  }

  // Navigate back to patients list
  const handleBackToPatients = () => {
    router.push("/doctor/patients")
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-soft-amber/90 to-amber-500 p-6 shadow-md">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10"></div>

        <div className="relative z-10">
          <button
            onClick={handleBackToPatients}
            className="mb-4 inline-flex items-center rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/30"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Patients
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              {!loading && patient && patient.photoURL ? (
                <img
                  src={patient.photoURL || "/placeholder.svg"}
                  alt={patient.displayName}
                  className="mr-4 h-16 w-16 rounded-full border-2 border-white/50 object-cover"
                />
              ) : !loading && patient ? (
                <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white">
                  <User className="h-8 w-8" />
                </div>
              ) : (
                <div className="mr-4 h-16 w-16 animate-pulse rounded-full bg-white/20"></div>
              )}

              <div>
                {loading ? (
                  <>
                    <div className="h-7 w-48 animate-pulse rounded-md bg-white/20 mb-2"></div>
                    <div className="h-5 w-32 animate-pulse rounded-md bg-white/20"></div>
                  </>
                ) : patient ? (
                  <>
                    <h1 className="text-2xl font-bold text-white md:text-3xl">{patient.displayName}</h1>
                    <p className="mt-1 text-amber-50">Patient Profile</p>
                  </>
                ) : (
                  <h1 className="text-2xl font-bold text-white md:text-3xl">Patient Not Found</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        // Loading state
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber mb-4"></div>
            <p className="text-drift-gray">Loading patient information...</p>
          </div>
        </div>
      ) : error ? (
        // Error state
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <div className="flex justify-center mb-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-red-800">Error</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={handleBackToPatients}
            className="mt-4 inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm border border-red-200 transition-colors hover:bg-red-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </button>
        </div>
      ) : patient ? (
        <>
          {/* Enhanced tab controls with switch-like appearance */}
          <div className="flex justify-center mb-6 mt-8">
            <div className="flex p-1 bg-earth-beige/20 rounded-full shadow-sm">
              <button
                onClick={() => setActiveTab("profile")}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeTab === "profile" ? "bg-soft-amber text-white shadow-sm" : "text-drift-gray hover:text-graphite"
                }`}
              >
                <span className="relative z-10">Patient Profile</span>
              </button>
              <button
                onClick={() => setActiveTab("appointments")}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeTab === "appointments"
                    ? "bg-soft-amber text-white shadow-sm"
                    : "text-drift-gray hover:text-graphite"
                }`}
              >
                <span className="relative z-10">Appointment History</span>
              </button>
            </div>
          </div>

          {/* Conditional rendering based on active tab */}
          {activeTab === "profile" ? (
            <>
              {/* Patient Information */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Contact Information */}
                <div className="rounded-lg border border-pale-stone bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-soft-amber/30">
                  <h2 className="mb-4 text-lg font-semibold text-graphite">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <User className="mr-3 mt-0.5 h-5 w-5 text-soft-amber" />
                      <div>
                        <p className="text-sm font-medium text-graphite">Full Name</p>
                        <p className="text-drift-gray">{patient.displayName}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="mr-3 mt-0.5 h-5 w-5 text-soft-amber" />
                      <div>
                        <p className="text-sm font-medium text-graphite">Email</p>
                        <p className="text-drift-gray">{patient.email || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="mr-3 mt-0.5 h-5 w-5 text-soft-amber" />
                      <div>
                        <p className="text-sm font-medium text-graphite">Phone</p>
                        <p className="text-drift-gray">{patient.phoneNumber || patient.phone || "Not provided"}</p>
                      </div>
                    </div>
                    {patient.address && (
                      <div className="flex items-start">
                        <MapPin className="mr-3 mt-0.5 h-5 w-5 text-soft-amber" />
                        <div>
                          <p className="text-sm font-medium text-graphite">Address</p>
                          <p className="text-drift-gray">{patient.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Medical Information */}
                <div className="rounded-lg border border-pale-stone bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-soft-amber/30">
                  <h2 className="mb-4 text-lg font-semibold text-graphite">Medical Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Calendar className="mr-3 mt-0.5 h-5 w-5 text-soft-amber" />
                      <div>
                        <p className="text-sm font-medium text-graphite">Date of Birth</p>
                        <p className="text-drift-gray">
                          {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Activity className="mr-3 mt-0.5 h-5 w-5 text-soft-amber" />
                      <div>
                        <p className="text-sm font-medium text-graphite">Blood Type</p>
                        <p className="text-drift-gray">{patient.bloodType || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Stethoscope className="mr-3 mt-0.5 h-5 w-5 text-soft-amber" />
                      <div>
                        <p className="text-sm font-medium text-graphite">Allergies</p>
                        <p className="text-drift-gray">{patient.allergies || "None reported"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Pill className="mr-3 mt-0.5 h-5 w-5 text-soft-amber" />
                      <div>
                        <p className="text-sm font-medium text-graphite">Current Medications</p>
                        <p className="text-drift-gray">{patient.medications || "None reported"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interaction Summary */}
                <div className="rounded-lg border border-pale-stone bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-soft-amber/30">
                  <h2 className="mb-4 text-lg font-semibold text-graphite">Interaction Summary</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CalendarDays className="mr-3 mt-0.5 h-5 w-5 text-soft-amber" />
                      <div>
                        <p className="text-sm font-medium text-graphite">Appointments</p>
                        <p className="text-drift-gray">{interactions.appointments} total</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MessageCircle className="mr-3 mt-0.5 h-5 w-5 text-soft-amber" />
                      <div>
                        <p className="text-sm font-medium text-graphite">Messages</p>
                        <p className="text-drift-gray">{interactions.messages} total</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FileIcon className="mr-3 mt-0.5 h-5 w-5 text-soft-amber" />
                      <div>
                        <p className="text-sm font-medium text-graphite">Medical Records</p>
                        <p className="text-drift-gray">{interactions.records} total</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="mr-3 mt-0.5 h-5 w-5 text-soft-amber" />
                      <div>
                        <p className="text-sm font-medium text-graphite">Last Interaction</p>
                        <p className="text-drift-gray">
                          {interactions.lastInteraction
                            ? formatDate(interactions.lastInteraction)
                            : "No interactions yet"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Shield className="mr-3 mt-0.5 h-5 w-5 text-soft-amber" />
                      <div>
                        <p className="text-sm font-medium text-graphite">Records Access</p>
                        <p className="text-drift-gray">
                          Patient must explicitly share medical records with you to view them
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <button
                  onClick={handleViewAppointments}
                  className="group flex items-center justify-between rounded-lg border border-pale-stone bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-soft-amber/30"
                >
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-soft-amber/10 text-soft-amber group-hover:bg-soft-amber/20">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-graphite">Appointments</h3>
                      <p className="text-sm text-drift-gray">View history</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-drift-gray group-hover:text-soft-amber transition-colors" />
                </button>

                <button
                  onClick={handleViewMessages}
                  className="group flex items-center justify-between rounded-lg border border-pale-stone bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-soft-amber/30"
                >
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-soft-amber/10 text-soft-amber group-hover:bg-soft-amber/20">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-graphite">Messages</h3>
                      <p className="text-sm text-drift-gray">Chat history</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-drift-gray group-hover:text-soft-amber transition-colors" />
                </button>

                <button
                  onClick={handleViewRecords}
                  className="group flex items-center justify-between rounded-lg border border-pale-stone bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-soft-amber/30"
                >
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-soft-amber/10 text-soft-amber group-hover:bg-soft-amber/20">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-graphite">Medical Records</h3>
                      <p className="text-sm text-drift-gray">View shared records</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-drift-gray group-hover:text-soft-amber transition-colors" />
                </button>

                <button
                  onClick={handleViewPrescriptions}
                  className="group flex items-center justify-between rounded-lg border border-pale-stone bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-soft-amber/30"
                >
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-soft-amber/10 text-soft-amber group-hover:bg-soft-amber/20">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-graphite">Prescriptions</h3>
                      <p className="text-sm text-drift-gray">Manage prescriptions</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-drift-gray group-hover:text-soft-amber transition-colors" />
                </button>
              </div>
            </>
          ) : (
            // Appointment History Tab Content
            <AppointmentHistory userId={patientId} viewMode="doctor" doctorId={user?.uid} />
          )}
        </>
      ) : (
        // Not found
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <div className="flex justify-center mb-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-red-800">Patient Not Found</h3>
          <p className="text-red-600">The patient you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={handleBackToPatients}
            className="mt-4 inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm border border-red-200 transition-colors hover:bg-red-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </button>
        </div>
      )}

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
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
=======
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  FileText,
  MessageSquare,
  Phone,
  User,
  Clock,
  Pill,
  Activity,
  Heart,
  Weight,
  Ruler,
} from "lucide-react"

export default function PatientDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState(null)

  // Mock patients data
  const patients = [
    {
      id: 1,
      name: "John Smith",
      age: 45,
      gender: "Male",
      dob: "1978-05-15",
      phone: "+1 (555) 123-4567",
      email: "john.smith@example.com",
      address: "123 Main St, Anytown, CA 12345",
      bloodType: "O+",
      allergies: "Penicillin, Peanuts",
      conditions: "Hypertension, Asthma",
      medications: [
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
        { name: "Albuterol", dosage: "90mcg", frequency: "As needed" },
      ],
      vitalSigns: {
        bloodPressure: "130/85",
        heartRate: "72",
        temperature: "98.6",
        respiratoryRate: "16",
        height: "5'10\"",
        weight: "180 lbs",
        bmi: "25.8",
      },
    },
    {
      id: 2,
      name: "Emily Johnson",
      age: 32,
      gender: "Female",
      dob: "1991-08-22",
      phone: "+1 (555) 987-6543",
      email: "emily.johnson@example.com",
      address: "456 Oak Ave, Somewhere, CA 67890",
      bloodType: "A-",
      allergies: "Sulfa drugs",
      conditions: "Migraine, Anxiety",
      medications: [
        { name: "Sumatriptan", dosage: "50mg", frequency: "As needed for migraines" },
        { name: "Sertraline", dosage: "50mg", frequency: "Once daily" },
      ],
      vitalSigns: {
        bloodPressure: "118/75",
        heartRate: "68",
        temperature: "98.2",
        respiratoryRate: "14",
        height: "5'6\"",
        weight: "135 lbs",
        bmi: "21.8",
      },
    },
    {
      id: 3,
      name: "Michael Brown",
      age: 58,
      gender: "Male",
      dob: "1965-03-10",
      phone: "+1 (555) 456-7890",
      email: "michael.brown@example.com",
      address: "789 Pine St, Elsewhere, CA 54321",
      bloodType: "B+",
      allergies: "None",
      conditions: "Type 2 Diabetes, Coronary Artery Disease",
      medications: [
        { name: "Metformin", dosage: "1000mg", frequency: "Twice daily" },
        { name: "Atorvastatin", dosage: "40mg", frequency: "Once daily" },
        { name: "Aspirin", dosage: "81mg", frequency: "Once daily" },
      ],
      vitalSigns: {
        bloodPressure: "142/88",
        heartRate: "78",
        temperature: "98.4",
        respiratoryRate: "18",
        height: "5'11\"",
        weight: "210 lbs",
        bmi: "29.3",
      },
    },
    {
      id: 4,
      name: "Sarah Davis",
      age: 27,
      gender: "Female",
      dob: "1996-11-05",
      phone: "+1 (555) 234-5678",
      email: "sarah.davis@example.com",
      address: "321 Elm St, Nowhere, CA 13579",
      bloodType: "AB+",
      allergies: "Latex",
      conditions: "Asthma, Pregnancy (20 weeks)",
      medications: [
        { name: "Prenatal vitamins", dosage: "1 tablet", frequency: "Once daily" },
        { name: "Albuterol", dosage: "90mcg", frequency: "As needed" },
      ],
      vitalSigns: {
        bloodPressure: "110/70",
        heartRate: "82",
        temperature: "98.8",
        respiratoryRate: "16",
        height: "5'4\"",
        weight: "145 lbs",
        bmi: "24.9",
      },
    },
    {
      id: 5,
      name: "Robert Wilson",
      age: 62,
      gender: "Male",
      dob: "1961-01-30",
      phone: "+1 (555) 876-5432",
      email: "robert.wilson@example.com",
      address: "654 Maple Dr, Anyplace, CA 97531",
      bloodType: "O-",
      allergies: "Shellfish",
      conditions: "Osteoarthritis, GERD",
      medications: [
        { name: "Omeprazole", dosage: "20mg", frequency: "Once daily" },
        { name: "Acetaminophen", dosage: "500mg", frequency: "As needed for pain" },
      ],
      vitalSigns: {
        bloodPressure: "138/82",
        heartRate: "70",
        temperature: "98.0",
        respiratoryRate: "15",
        height: "5'8\"",
        weight: "175 lbs",
        bmi: "26.6",
      },
    },
  ]

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      patientId: 1,
      date: "2023-06-15",
      time: "10:00 AM",
      type: "Follow-up",
      status: "upcoming",
      notes: "Blood pressure check",
    },
    {
      id: 2,
      patientId: 1,
      date: "2023-05-10",
      time: "11:15 AM",
      type: "Initial Visit",
      status: "completed",
      notes: "Annual physical",
    },
    {
      id: 3,
      patientId: 2,
      date: "2023-06-20",
      time: "2:30 PM",
      type: "Consultation",
      status: "upcoming",
      notes: "Discuss MRI results",
    },
    {
      id: 4,
      patientId: 3,
      date: "2023-06-18",
      time: "9:00 AM",
      type: "Follow-up",
      status: "upcoming",
      notes: "Diabetes management",
    },
  ]

  // Find patient by ID
  useEffect(() => {
    if (params.id) {
      const foundPatient = patients.find((p) => p.id.toString() === params.id)
      if (foundPatient) {
        setPatient(foundPatient)
      } else {
        // Handle patient not found
        router.push("/doctor/patients")
      }
    }
  }, [params.id, router])

  // Filter appointments for this patient
  const patientAppointments = appointments
    .filter((appointment) => appointment.patientId.toString() === params.id)
    .sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time))

  // Handle back button
  const handleBack = () => {
    router.push("/doctor/patients")
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-soft-amber border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={handleBack}
          className="mr-4 rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-graphite md:text-3xl">Patient Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Patient Profile */}
        <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full bg-pale-stone">
              <User className="h-full w-full p-4 text-drift-gray" />
            </div>
            <h2 className="text-xl font-semibold text-graphite">{patient.name}</h2>
            <p className="text-drift-gray">
              {patient.gender}, {patient.age} years
            </p>
            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-soft-amber" />
                <span className="text-sm text-drift-gray">DOB: {new Date(patient.dob).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-soft-amber" />
                <span className="text-sm text-drift-gray">{patient.phone}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4 text-soft-amber" />
                <span className="text-sm text-drift-gray">{patient.email}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center space-x-2">
            <Link
              href={`/doctor/patients/${patient.id}/records`}
              className="inline-flex items-center rounded-md bg-soft-amber px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
            >
              <FileText className="mr-1 h-4 w-4" />
              Records
            </Link>
            <Link
              href={`/doctor/chat?patient=${patient.id}`}
              className="inline-flex items-center rounded-md border border-earth-beige bg-white px-3 py-1.5 text-sm font-medium text-graphite transition-colors hover:bg-pale-stone"
            >
              <MessageSquare className="mr-1 h-4 w-4" />
              Message
            </Link>
          </div>
        </div>

        {/* Medical Information */}
        <div className="col-span-2 rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-graphite">Medical Information</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-md bg-pale-stone/50 p-3">
              <div className="flex items-center">
                <div className="mr-2 h-8 w-8 rounded-full bg-soft-amber/20 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-soft-amber" />
                </div>
                <div>
                  <p className="text-sm font-medium text-graphite">Blood Type</p>
                  <p className="text-lg font-bold text-soft-amber">{patient.bloodType}</p>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-pale-stone/50 p-3">
              <p className="text-sm font-medium text-graphite">Allergies</p>
              <p className="text-sm text-drift-gray">{patient.allergies || "None"}</p>
            </div>

            <div className="rounded-md bg-pale-stone/50 p-3">
              <p className="text-sm font-medium text-graphite">Medical Conditions</p>
              <p className="text-sm text-drift-gray">{patient.conditions || "None"}</p>
            </div>

            <div className="rounded-md bg-pale-stone/50 p-3">
              <p className="text-sm font-medium text-graphite">Address</p>
              <p className="text-sm text-drift-gray">{patient.address}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-2 text-lg font-medium text-graphite">Current Medications</h3>
            {patient.medications && patient.medications.length > 0 ? (
              <div className="space-y-2">
                {patient.medications.map((medication, index) => (
                  <div key={index} className="flex items-start rounded-md border border-pale-stone p-3">
                    <Pill className="mr-2 h-5 w-5 text-soft-amber" />
                    <div>
                      <p className="font-medium text-graphite">{medication.name}</p>
                      <p className="text-sm text-drift-gray">
                        {medication.dosage} - {medication.frequency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-drift-gray">No current medications</p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="mb-2 text-lg font-medium text-graphite">Vital Signs</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="rounded-md bg-pale-stone/30 p-3 text-center">
                <Heart className="mx-auto mb-1 h-5 w-5 text-soft-amber" />
                <p className="text-xs text-drift-gray">Blood Pressure</p>
                <p className="text-sm font-medium text-graphite">{patient.vitalSigns.bloodPressure}</p>
              </div>
              <div className="rounded-md bg-pale-stone/30 p-3 text-center">
                <Activity className="mx-auto mb-1 h-5 w-5 text-soft-amber" />
                <p className="text-xs text-drift-gray">Heart Rate</p>
                <p className="text-sm font-medium text-graphite">{patient.vitalSigns.heartRate} bpm</p>
              </div>
              <div className="rounded-md bg-pale-stone/30 p-3 text-center">
                <Weight className="mx-auto mb-1 h-5 w-5 text-soft-amber" />
                <p className="text-xs text-drift-gray">Weight</p>
                <p className="text-sm font-medium text-graphite">{patient.vitalSigns.weight}</p>
              </div>
              <div className="rounded-md bg-pale-stone/30 p-3 text-center">
                <Ruler className="mx-auto mb-1 h-5 w-5 text-soft-amber" />
                <p className="text-xs text-drift-gray">Height</p>
                <p className="text-sm font-medium text-graphite">{patient.vitalSigns.height}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="col-span-full rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-graphite">Appointments</h2>
            <Link
              href={`/doctor/appointments?patient=${patient.id}`}
              className="text-sm font-medium text-soft-amber hover:underline"
            >
              Schedule Appointment
            </Link>
          </div>

          {patientAppointments.length > 0 ? (
            <div className="space-y-4">
              {patientAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`flex flex-col rounded-lg border border-pale-stone p-4 sm:flex-row sm:items-center sm:justify-between ${
                    appointment.status === "completed" ? "opacity-70" : ""
                  }`}
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-graphite">{appointment.type}</p>
                    <p className="text-sm text-drift-gray">{appointment.notes}</p>
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
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${
                        appointment.status === "upcoming" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-drift-gray">No appointments scheduled</p>
          )}
        </div>
      </div>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    </div>
  )
}
