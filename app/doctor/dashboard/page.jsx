"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Clock, FileText, MessageSquare, Plus, User, Users, Clock8 } from "lucide-react"
import { MiniCalendar } from "@/components/mini-calendar"
import { AppointmentModal } from "@/components/appointment-modal"
import { DoctorAvailabilityModal } from "@/components/doctor-availability-modal"
import { AvailabilitySuccessModal } from "@/components/availability-success-modal"
import { AppointmentSuccessModal } from "@/components/appointment-success-modal"

export default function DoctorDashboard() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false)
  const [unavailableDates, setUnavailableDates] = useState([])
  const [showAvailabilitySuccessModal, setShowAvailabilitySuccessModal] = useState(false)
  const [showAppointmentSuccessModal, setShowAppointmentSuccessModal] = useState(false)
  const [appointmentSuccessMessage, setAppointmentSuccessMessage] = useState("")

  // Load unavailable dates on component mount
  useEffect(() => {
    const savedDates = localStorage.getItem("doctorUnavailableDates")
    if (savedDates) {
      setUnavailableDates(JSON.parse(savedDates))
    }
  }, [])

  // Handle saving unavailable dates
  const handleSaveAvailability = (dates) => {
    console.log("Saved unavailable dates:", dates)
    setShowAvailabilitySuccessModal(true)
  }

  const handleBookAppointment = (appointmentData) => {
    console.log("New appointment booked:", appointmentData)
    setAppointmentSuccessMessage("Appointment scheduled successfully!")
    setShowAppointmentSuccessModal(true)
  }

  // Mock data
  const todayAppointments = [
    {
      id: 1,
      patient: "John Smith",
      age: 45,
      time: "10:00 AM",
      status: "confirmed",
      reason: "Annual checkup",
    },
    {
      id: 2,
      patient: "Emily Johnson",
      age: 32,
      time: "11:30 AM",
      status: "confirmed",
      reason: "Follow-up consultation",
    },
    {
      id: 3,
      patient: "Michael Brown",
      age: 58,
      time: "2:00 PM",
      status: "confirmed",
      reason: "Blood pressure monitoring",
    },
  ]

  const recentPrescriptions = [
    {
      id: 1,
      patient: "John Smith",
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times daily",
      date: "2023-06-01",
    },
    {
      id: 2,
      patient: "Emily Johnson",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      date: "2023-05-15",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-graphite md:text-3xl">Doctor Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsAvailabilityModalOpen(true)}
            className="inline-flex items-center rounded-md bg-white border border-soft-amber px-4 py-2 text-sm font-medium text-soft-amber shadow-sm transition-colors hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
          >
            <Clock8 className="mr-2 h-4 w-4" />
            Manage Availability
          </button>
          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="inline-flex items-center rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Schedule Appointment
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats */}
        <div className="col-span-full grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Today's Appointments */}
          <div className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-drift-gray">Today's Appointments</h3>
              <Calendar className="h-5 w-5 text-soft-amber" />
            </div>
            <p className="mt-2 text-2xl font-bold text-graphite">{todayAppointments.length}</p>
            <p className="text-sm text-drift-gray">Scheduled</p>
          </div>

          {/* Patients */}
          <div className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-drift-gray">Total Patients</h3>
              <Users className="h-5 w-5 text-soft-amber" />
            </div>
            <p className="mt-2 text-2xl font-bold text-graphite">42</p>
            <p className="text-sm text-drift-gray">Active</p>
          </div>

          {/* Prescriptions */}
          <div className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-drift-gray">Prescriptions</h3>
              <FileText className="h-5 w-5 text-soft-amber" />
            </div>
            <p className="mt-2 text-2xl font-bold text-graphite">18</p>
            <p className="text-sm text-drift-gray">This month</p>
          </div>

          {/* Messages */}
          <div className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-drift-gray">Messages</h3>
              <MessageSquare className="h-5 w-5 text-soft-amber" />
            </div>
            <p className="mt-2 text-2xl font-bold text-graphite">5</p>
            <p className="text-sm text-drift-gray">Unread</p>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="col-span-full rounded-lg border border-pale-stone bg-white p-6 shadow-sm md:col-span-1 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-graphite">Today's Appointments</h2>
            <Link href="/doctor/appointments" className="text-sm font-medium text-soft-amber hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col rounded-lg border border-pale-stone p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-graphite">{appointment.patient}</p>
                    <p className="text-sm text-drift-gray">
                      Age: {appointment.age} - {appointment.reason}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-drift-gray">
                      <Clock className="mr-1 h-4 w-4" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                    <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium capitalize text-green-800">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-drift-gray">No appointments scheduled for today</p>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-graphite">Calendar</h2>
            {unavailableDates.length > 0 && (
              <span className="text-xs font-medium text-red-500">
                {unavailableDates.length} unavailable {unavailableDates.length === 1 ? "day" : "days"}
              </span>
            )}
          </div>
          <MiniCalendar unavailableDates={unavailableDates.map((d) => d.date)} />
        </div>

        {/* Recent Prescriptions */}
        <div className="col-span-full rounded-lg border border-pale-stone bg-white p-6 shadow-sm md:col-span-1 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-graphite">Recent Prescriptions</h2>
            <Link href="/doctor/prescriptions" className="text-sm font-medium text-soft-amber hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentPrescriptions.length > 0 ? (
              recentPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="flex flex-col rounded-lg border border-pale-stone p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-graphite">{prescription.medication}</p>
                    <p className="text-sm text-drift-gray">
                      {prescription.dosage} - {prescription.frequency}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-drift-gray">
                      <User className="mr-1 h-4 w-4" />
                      <span className="text-sm">{prescription.patient}</span>
                    </div>
                    <div className="flex items-center text-drift-gray">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span className="text-sm">{new Date(prescription.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-drift-gray">No recent prescriptions</p>
            )}
          </div>
        </div>

        {/* Patient Insights */}
        <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-graphite">Patient Insights</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-pale-stone p-4">
              <h3 className="font-medium text-graphite">New Patients</h3>
              <p className="mt-1 text-sm text-drift-gray">5 new patients registered this week</p>
            </div>
            <div className="rounded-lg bg-pale-stone p-4">
              <h3 className="font-medium text-graphite">Follow-ups</h3>
              <p className="mt-1 text-sm text-drift-gray">12 follow-up appointments scheduled for next week</p>
            </div>
            <div className="rounded-lg bg-pale-stone p-4">
              <h3 className="font-medium text-graphite">Patient Satisfaction</h3>
              <p className="mt-1 text-sm text-drift-gray">Average rating: 4.8/5 from 24 recent appointments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        userRole="doctor"
        onBook={handleBookAppointment}
        patients={[
          { id: 1, name: "John Smith", age: 45 },
          { id: 2, name: "Emily Johnson", age: 32 },
          { id: 3, name: "Michael Brown", age: 58 },
          { id: 4, name: "Sarah Davis", age: 27 },
        ]}
      />

      <DoctorAvailabilityModal
        isOpen={isAvailabilityModalOpen}
        onClose={() => setIsAvailabilityModalOpen(false)}
        onSave={handleSaveAvailability}
      />

      {/* Availability Success Modal */}
      <AvailabilitySuccessModal
        isOpen={showAvailabilitySuccessModal}
        onClose={() => setShowAvailabilitySuccessModal(false)}
        message="Your availability has been updated successfully!"
      />

      {/* Appointment Success Modal */}
      <AppointmentSuccessModal
        isOpen={showAppointmentSuccessModal}
        onClose={() => setShowAppointmentSuccessModal(false)}
        message={appointmentSuccessMessage}
      />
    </div>
  )
}
