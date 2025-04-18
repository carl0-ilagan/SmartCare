"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Calendar, Clock, MessageSquare, Pill, Plus, User } from "lucide-react"
import { MiniCalendar } from "@/components/mini-calendar"
import { AppointmentModal } from "@/components/appointment-modal"
import { SuccessNotification } from "@/components/success-notification"

export default function PatientDashboard() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [notification, setNotification] = useState({ message: "", isVisible: false })
  const searchParams = useSearchParams()

  // Check for success message in URL parameters
  useEffect(() => {
    const success = searchParams.get("success")
    const message = searchParams.get("message")

    if (success === "true" && message) {
      setNotification({
        message: decodeURIComponent(message),
        isVisible: true,
      })
    }
  }, [searchParams])

  // Mock data
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2023-06-15",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "2023-06-20",
      time: "2:30 PM",
      status: "confirmed",
    },
  ]

  const recentPrescriptions = [
    {
      id: 1,
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times daily",
      doctor: "Dr. Sarah Johnson",
      date: "2023-06-01",
    },
    {
      id: 2,
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      doctor: "Dr. Sarah Johnson",
      date: "2023-05-15",
    },
  ]

  // Handle booking a new appointment
  const handleBookAppointment = (newAppointment) => {
    // In a real app, this would save to the backend

    // Show success notification
    setNotification({
      message: "Appointment booked successfully",
      isVisible: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite md:text-3xl">Dashboard</h1>
        <button
          onClick={() => setIsAppointmentModalOpen(true)}
          className="inline-flex items-center rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Book Appointment
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats */}
        <div className="col-span-full grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Appointments */}
          <div className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-drift-gray">Appointments</h3>
              <Calendar className="h-5 w-5 text-soft-amber" />
            </div>
            <p className="mt-2 text-2xl font-bold text-graphite">{upcomingAppointments.length}</p>
            <p className="text-sm text-drift-gray">Upcoming</p>
          </div>

          {/* Prescriptions */}
          <div className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-drift-gray">Prescriptions</h3>
              <Pill className="h-5 w-5 text-soft-amber" />
            </div>
            <p className="mt-2 text-2xl font-bold text-graphite">{recentPrescriptions.length}</p>
            <p className="text-sm text-drift-gray">Active</p>
          </div>

          {/* Messages */}
          <div className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-drift-gray">Messages</h3>
              <MessageSquare className="h-5 w-5 text-soft-amber" />
            </div>
            <p className="mt-2 text-2xl font-bold text-graphite">3</p>
            <p className="text-sm text-drift-gray">Unread</p>
          </div>

          {/* Doctors */}
          <div className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-drift-gray">Doctors</h3>
              <User className="h-5 w-5 text-soft-amber" />
            </div>
            <p className="mt-2 text-2xl font-bold text-graphite">2</p>
            <p className="text-sm text-drift-gray">Connected</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="col-span-full rounded-lg border border-pale-stone bg-white p-6 shadow-sm md:col-span-1 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-graphite">Upcoming Appointments</h2>
            <Link href="/dashboard/appointments" className="text-sm font-medium text-soft-amber hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col rounded-lg border border-pale-stone p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-graphite">{appointment.doctor}</p>
                    <p className="text-sm text-drift-gray">{appointment.specialty}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-drift-gray">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span className="text-sm">{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
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
              <p className="text-center text-drift-gray">No upcoming appointments</p>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-graphite">Calendar</h2>
          <MiniCalendar />
        </div>

        {/* Recent Prescriptions */}
        <div className="col-span-full rounded-lg border border-pale-stone bg-white p-6 shadow-sm md:col-span-1 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-graphite">Recent Prescriptions</h2>
            <Link href="/dashboard/prescriptions" className="text-sm font-medium text-soft-amber hover:underline">
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
                      <span className="text-sm">{prescription.doctor}</span>
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

        {/* Health Tips */}
        <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-graphite">Health Tips</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-pale-stone p-4">
              <h3 className="font-medium text-graphite">Stay Hydrated</h3>
              <p className="mt-1 text-sm text-drift-gray">
                Drink at least 8 glasses of water daily to maintain proper hydration.
              </p>
            </div>
            <div className="rounded-lg bg-pale-stone p-4">
              <h3 className="font-medium text-graphite">Regular Exercise</h3>
              <p className="mt-1 text-sm text-drift-gray">
                Aim for at least 30 minutes of moderate exercise 5 days a week.
              </p>
            </div>
            <div className="rounded-lg bg-pale-stone p-4">
              <h3 className="font-medium text-graphite">Balanced Diet</h3>
              <p className="mt-1 text-sm text-drift-gray">
                Include fruits, vegetables, whole grains, and lean proteins in your daily meals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals and Notifications */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        userRole="patient"
        onBook={handleBookAppointment}
      />

      <SuccessNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </div>
  )
}
