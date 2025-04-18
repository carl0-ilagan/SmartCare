"use client"

import { useState, useEffect } from "react"
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
    </div>
  )
}
