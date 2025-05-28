"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  Briefcase,
  MessageSquare,
  ArrowLeft,
  CalendarIcon,
  AlertTriangle,
  Circle,
  Clock,
  CheckCircle,
  Globe,
  Stethoscope,
} from "lucide-react"
import { AppointmentModal } from "@/components/appointment-modal"
import { useAuth } from "@/contexts/auth-context"
import { getPublicDoctorProfile } from "@/lib/doctor-utils"
import { checkExistingConversation, createConversation } from "@/lib/message-utils"
import ProfileImage from "@/components/profile-image"
import { getDoctorAvailability } from "@/lib/appointment-utils"

export default function DoctorProfile() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [doctor, setDoctor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [appointmentSuccess, setAppointmentSuccess] = useState(false)
  const [isMessageLoading, setIsMessageLoading] = useState(false)
  const [availability, setAvailability] = useState([])
  const [availabilityLoading, setAvailabilityLoading] = useState(true)

  useEffect(() => {
    const fetchDoctorData = async () => {
      setIsLoading(true)
      try {
        console.log("Fetching doctor data for ID:", id)

        // Check if user is authenticated
        if (!user) {
          console.log("User not authenticated, redirecting to login")
          router.push("/login")
          return
        }

        // Use our helper function to safely fetch doctor data
        const doctorData = await getPublicDoctorProfile(id)

        if (!doctorData) {
          setError("Doctor not found")
          setIsLoading(false)
          return
        }

        // Ensure education, certifications, and languages are arrays
        const formattedDoctor = {
          ...doctorData,
          education: Array.isArray(doctorData.education)
            ? doctorData.education
            : [doctorData.education].filter(Boolean),
          certifications: Array.isArray(doctorData.certifications)
            ? doctorData.certifications
            : [doctorData.certifications].filter(Boolean),
          languages: Array.isArray(doctorData.languages)
            ? doctorData.languages
            : [doctorData.languages].filter(Boolean),
        }

        setDoctor(formattedDoctor)
        console.log("Doctor data processed successfully", formattedDoctor)

        // Fetch doctor availability
        fetchDoctorAvailability(id)
      } catch (error) {
        console.error("Error fetching doctor data:", error)

        // Handle specific error types
        if (error.code === "permission-denied") {
          setError("You don't have permission to view this doctor's profile. This may be due to security restrictions.")
        } else {
          setError("Failed to load doctor profile. Please try again later.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchDoctorData()
    }
  }, [id, user, router])

  const fetchDoctorAvailability = async (doctorId) => {
    setAvailabilityLoading(true)
    try {
      const unavailableDates = await getDoctorAvailability(doctorId)
      setAvailability(unavailableDates)
      console.log("Doctor unavailable dates:", unavailableDates)
    } catch (error) {
      console.error("Error fetching doctor availability:", error)
    } finally {
      setAvailabilityLoading(false)
    }
  }

  const handleBookAppointment = () => {
    setIsAppointmentModalOpen(true)
  }

  const handleAppointmentSuccess = () => {
    setIsAppointmentModalOpen(false)
    setAppointmentSuccess(true)

    // Reset success message after 5 seconds
    setTimeout(() => {
      setAppointmentSuccess(false)
    }, 5000)
  }

  const handleMessageDoctor = async () => {
    if (!user || !doctor) return

    setIsMessageLoading(true)

    try {
      // Check if there's an existing conversation
      const existingConversationId = await checkExistingConversation([user.uid, doctor.id])

      if (existingConversationId) {
        // If conversation exists, navigate to it
        router.push(`/dashboard/messages?conversation=${existingConversationId}`)
      } else {
        // Create a new conversation
        const firstMessage = `Hello Dr. ${doctor.lastName || doctor.displayName.split(" ").pop() || ""}, I'd like to discuss my health concerns with you.`
        const conversationId = await createConversation([user.uid, doctor.id], firstMessage)

        // Navigate to the new conversation
        router.push(`/dashboard/messages?conversation=${conversationId}`)
      }
    } catch (error) {
      console.error("Error starting conversation:", error)
      alert("Failed to start conversation. Please try again.")
    } finally {
      setIsMessageLoading(false)
    }
  }

  // Helper function to safely render arrays
  const renderArray = (arr, renderItem) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) {
      return <li className="text-drift-gray">Information not available</li>
    }
    return arr.map((item, index) => renderItem(item, index))
  }

  // Get the current day of the week
  const getDayOfWeek = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[new Date().getDay()]
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
          <p className="text-drift-gray">Loading doctor profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-graphite">{error}</h2>
        <p className="mb-6 text-drift-gray">
          {error.includes("permission")
            ? "This could be due to security settings. Please contact support if you believe this is an error."
            : "The doctor profile you're looking for could not be found or is currently unavailable."}
        </p>
        <button
          onClick={() => router.back()}
          className="flex items-center rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Banner with back button on the right */}
      <div className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Doctor Profile</h1>
            <p className="mt-1 text-amber-100">View doctor information and book appointments</p>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center rounded-md bg-white/20 px-3 py-2 text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      {/* Success message */}
      {appointmentSuccess && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-green-800">
          <p className="flex items-center font-medium">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Appointment booked successfully!
          </p>
        </div>
      )}

      {/* Doctor profile header */}
      <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-amber-100 bg-pale-stone sm:h-32 sm:w-32">
            <ProfileImage
              src={doctor?.photoURL}
              alt={doctor?.displayName}
              className="h-full w-full object-cover"
              role="doctor"
            />
            <div
              className={`absolute bottom-1 right-1 flex items-center rounded-full bg-white px-2 py-0.5 text-xs ${doctor?.isOnline ? "text-green-600" : "text-gray-500"}`}
            >
              <Circle
                className={`mr-1 h-2 w-2 ${doctor?.isOnline ? "fill-green-500 text-green-500" : "fill-gray-400 text-gray-400"}`}
              />
              {doctor?.isOnline ? "Online" : "Offline"}
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
              <h1 className="text-2xl font-bold text-graphite md:text-3xl">{doctor?.displayName}</h1>
              {doctor?.verified && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-lg text-drift-gray">{doctor?.specialty}</p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {doctor?.experience && (
                <div className="flex items-center text-drift-gray">
                  <Briefcase className="mr-1 h-4 w-4" />
                  <span className="text-sm">{doctor?.experience}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-2 sm:items-end">
            <button
              onClick={handleBookAppointment}
              className="rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
            >
              Book Appointment
            </button>
            <button
              onClick={handleMessageDoctor}
              disabled={isMessageLoading}
              className="rounded-md border border-amber-500 px-4 py-2 text-amber-500 hover:bg-amber-50 flex items-center justify-center"
            >
              {isMessageLoading ? (
                <span className="flex items-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mr-2"></div>
                  Connecting...
                </span>
              ) : (
                <>
                  <MessageSquare className="mr-1 h-4 w-4" />
                  Message
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      

      {/* Doctor details */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column - About */}
        <div className="md:col-span-2 space-y-6">
          {/* About section */}
          {doctor?.bio && (
            <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-graphite">
                About Dr. {doctor?.lastName || doctor?.displayName.split(" ").pop()}
              </h2>
              <p className="text-drift-gray">{doctor?.bio}</p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {doctor?.education && doctor.education.length > 0 && (
                  <div>
                    <h3 className="mb-3 font-medium text-graphite flex items-center">
                      <Award className="mr-2 h-5 w-5 text-amber-500" />
                      Education
                    </h3>
                    <ul className="space-y-3 pl-7">
                      {renderArray(doctor?.education, (edu, index) => (
                        <li key={index} className="list-disc text-drift-gray">
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {doctor?.certifications && doctor.certifications.length > 0 && (
                  <div>
                    <h3 className="mb-3 font-medium text-graphite flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-amber-500" />
                      Certifications
                    </h3>
                    <ul className="space-y-3 pl-7">
                      {renderArray(doctor?.certifications, (cert, index) => (
                        <li key={index} className="list-disc text-drift-gray">
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {doctor?.languages && doctor.languages.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 font-medium text-graphite flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-amber-500" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2 pl-7">
                    {doctor.languages.map((lang, index) => (
                      <span key={index} className="rounded-full bg-pale-stone px-3 py-1 text-sm text-drift-gray">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Specialties section */}
          {doctor?.specialty && (
            <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-graphite flex items-center">
                <Stethoscope className="mr-2 h-5 w-5 text-amber-500" />
                Specialty
              </h2>

              <div className="rounded-md border border-pale-stone p-3">
                <h3 className="font-medium text-graphite">{doctor?.specialty}</h3>
                <p className="mt-1 text-sm text-drift-gray">
                  {doctor?.specialtyDescription || `Specializes in ${doctor?.specialty}`}
                </p>
              </div>
            </div>
          )}

          {/* Availability section */}
          <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-graphite flex items-center">
              <Clock className="mr-2 h-5 w-5 text-amber-500" />
              Availability
            </h2>

            {availabilityLoading ? (
              <div className="flex justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
              </div>
            ) : (
              <>
                {doctor?.workingHours && (
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {Object.entries(doctor.workingHours || {}).map(([day, hours]) => (
                      <div
                        key={day}
                        className={`rounded-md border p-3 ${getDayOfWeek() === day ? "border-amber-300 bg-amber-50" : "border-pale-stone"}`}
                      >
                        <h3 className="font-medium text-graphite">{day}</h3>
                        <p className="mt-1 text-sm text-drift-gray">{hours || "Not Available"}</p>
                        {getDayOfWeek() === day && <p className="text-xs text-amber-600 mt-1">Today</p>}
                      </div>
                    ))}
                  </div>
                )}

                {availability && availability.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-2 font-medium text-graphite">Unavailable Dates</h3>
                    <div className="rounded-md border border-pale-stone bg-red-50 p-3">
                      <p className="text-sm text-red-600 mb-2">The doctor is not available on the following dates:</p>
                      <div className="flex flex-wrap gap-2">
                        {availability.slice(0, 5).map((date, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-white px-3 py-1 text-xs text-red-600 border border-red-200"
                          >
                            {formatDate(date)}
                          </span>
                        ))}
                        {availability.length > 5 && (
                          <span className="rounded-full bg-white px-3 py-1 text-xs text-red-600 border border-red-200">
                            +{availability.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right column - Contact & Appointments */}
        <div className="space-y-6">
          {/* Contact information */}
          <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-graphite">Contact Information</h2>
            <ul className="space-y-4">
              {doctor?.address && (
                <li className="flex items-start">
                  <MapPin className="mr-3 h-5 w-5 text-amber-500" />
                  <span className="text-drift-gray">{doctor?.address}</span>
                </li>
              )}
              {doctor?.phone && (
                <li className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-amber-500" />
                  <span className="text-drift-gray">{doctor?.phone}</span>
                </li>
              )}
              {doctor?.email && (
                <li className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-amber-500" />
                  <span className="text-drift-gray">{doctor?.email}</span>
                </li>
              )}
            </ul>

            {doctor?.officeHours && (
              <div className="mt-4 rounded-md bg-pale-stone p-3">
                <h3 className="font-medium text-graphite">Office Hours</h3>
                <p className="mt-1 text-sm text-drift-gray">{doctor.officeHours}</p>
              </div>
            )}
          </div>

          {/* Book appointment section */}
          <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-graphite">Schedule an Appointment</h2>
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                <Calendar className="h-6 w-6" />
              </div>
              <p className="text-drift-gray">Ready to schedule your visit?</p>
              {doctor?.nextAvailable && (
                <p className="mt-1 text-sm text-drift-gray">Next available: {doctor.nextAvailable}</p>
              )}
              <button
                onClick={handleBookAppointment}
                className="mt-4 w-full rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        userRole="patient"
        onBook={handleAppointmentSuccess}
        selectedDoctor={doctor ? { id: doctor.id, name: doctor.displayName } : null}
      />
    </div>
  )
}
