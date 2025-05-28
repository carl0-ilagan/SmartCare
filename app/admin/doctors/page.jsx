"use client"
import { useState, useEffect } from "react"
import { Search, Filter, Eye, Trash2, UserX, Users, UserCheck, UserMinus, UserPlus } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, getDocs, where, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { AdminHeaderBanner } from "@/components/admin-header-banner"
import { useRouter } from "next/navigation"

// Fallback mock data in case Firestore fails
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    lastLogin: "Today, 10:30 AM",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    email: "michael.chen@example.com",
    phone: "+1 (555) 234-5678",
    lastLogin: "Yesterday, 3:15 PM",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [specialties, setSpecialties] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    new: 0,
  })
  const [error, setError] = useState(null)

  const router = useRouter()

  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [updateError, setUpdateError] = useState(null)

  // Fetch doctors data and stats
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true)
        setError(null)

        let doctorsData = []

        // First try the dedicated doctors collection
        console.log("Trying to fetch from 'doctors' collection...")
        const doctorsRef = collection(db, "doctors")
        const doctorsSnapshot = await getDocs(doctorsRef)

        console.log(`Found ${doctorsSnapshot.size} documents in 'doctors' collection`)

        if (doctorsSnapshot.size > 0) {
          doctorsSnapshot.forEach((doc) => {
            const data = doc.data()
            console.log("Doctor data from 'doctors' collection:", doc.id, data)

            doctorsData.push({
              id: doc.id,
              name: data.name || `Dr. ${data.firstName || ""} ${data.lastName || ""}`.trim() || "Unknown Doctor",
              specialty: data.specialty || "General",
              email: data.email || "",
              phone: data.phone || "",
              lastLogin: formatTimestamp(data.lastLogin),
              status: data.status || "active",
              avatar: data.photoURL || "/placeholder.svg?height=40&width=40",
              createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date(),
            })
          })
        } else {
          // If no doctors found, try the users collection with role=doctor
          console.log("No doctors found in 'doctors' collection. Trying 'users' collection with role=doctor...")
          const usersRef = collection(db, "users")
          const doctorsQuery = query(usersRef, where("role", "==", "doctor"))
          const usersSnapshot = await getDocs(doctorsQuery)

          console.log(`Found ${usersSnapshot.size} documents in 'users' collection with role=doctor`)

          if (usersSnapshot.size > 0) {
            usersSnapshot.forEach((doc) => {
              const data = doc.data()
              console.log("Doctor data from 'users' collection:", doc.id, data)

              doctorsData.push({
                id: doc.id,
                name:
                  data.displayName ||
                  data.name ||
                  `Dr. ${data.firstName || ""} ${data.lastName || ""}`.trim() ||
                  "Unknown Doctor",
                specialty: data.specialty || "General",
                email: data.email || "",
                phone: data.phone || "",
                lastLogin: formatTimestamp(data.lastLogin),
                status: data.status || "active",
                avatar: data.photoURL || "/placeholder.svg?height=40&width=40",
                createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date(),
              })
            })
          } else {
            // If still no doctors, try users collection without filtering
            console.log("No doctors found in 'users' collection with role=doctor. Trying all users...")
            const allUsersRef = collection(db, "users")
            const allUsersSnapshot = await getDocs(allUsersRef)

            console.log(`Found ${allUsersSnapshot.size} total documents in 'users' collection`)

            allUsersSnapshot.forEach((doc) => {
              const data = doc.data()
              console.log("User data:", doc.id, data)

              // Check if this looks like a doctor (has specialty or role contains "doctor")
              const role = (data.role || "").toLowerCase()
              if (data.specialty || role.includes("doctor") || role.includes("physician")) {
                doctorsData.push({
                  id: doc.id,
                  name:
                    data.displayName ||
                    data.name ||
                    `Dr. ${data.firstName || ""} ${data.lastName || ""}`.trim() ||
                    "Unknown Doctor",
                  specialty: data.specialty || "General",
                  email: data.email || "",
                  phone: data.phone || "",
                  lastLogin: formatTimestamp(data.lastLogin),
                  status: data.status || "active",
                  avatar: data.photoURL || "/placeholder.svg?height=40&width=40",
                  createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date(),
                })
              }
            })
          }
        }

        // If we still have no doctors, use mock data as fallback
        if (doctorsData.length === 0) {
          console.log("No doctors found in any collection. Using mock data as fallback.")
          doctorsData = mockDoctors
          setError("Could not find any doctors in the database. Showing mock data instead.")
        }

        console.log("Final processed doctors data:", doctorsData)

        // Extract specialties
        const specialtiesSet = new Set()
        doctorsData.forEach((doctor) => {
          if (doctor.specialty) {
            specialtiesSet.add(doctor.specialty)
          }
        })

        setDoctors(doctorsData)
        setFilteredDoctors(doctorsData)
        setSpecialties(Array.from(specialtiesSet))

        // Calculate stats
        const totalDoctors = doctorsData.length
        const activeDoctors = doctorsData.filter((doc) => doc.status === "active").length
        const inactiveDoctors = doctorsData.filter((doc) => doc.status === "inactive").length

        // Calculate new doctors in the last 7 days
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        const newDoctors = doctorsData.filter((doc) => doc.createdAt > oneWeekAgo).length

        setStats({
          total: totalDoctors,
          active: activeDoctors,
          inactive: inactiveDoctors,
          new: newDoctors,
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching doctors:", error)
        // Use mock data on error
        setDoctors(mockDoctors)
        setFilteredDoctors(mockDoctors)
        setSpecialties([...new Set(mockDoctors.map((d) => d.specialty))])
        setStats({
          total: mockDoctors.length,
          active: mockDoctors.filter((d) => d.status === "active").length,
          inactive: mockDoctors.filter((d) => d.status === "inactive").length,
          new: 0,
        })
        setError(`Error loading doctors: ${error.message}. Showing mock data instead.`)
        setIsLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  // Helper function to format timestamps
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Never"

    try {
      // Handle Firestore timestamp
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString()
      }
      // Handle Date object or string
      return new Date(timestamp).toLocaleString()
    } catch (e) {
      return "Unknown"
    }
  }

  // Handle search and filter
  useEffect(() => {
    let result = doctors

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((doctor) => doctor.status === statusFilter)
    }

    // Apply specialty filter
    if (specialtyFilter !== "all") {
      result = result.filter((doctor) => doctor.specialty === specialtyFilter)
    }

    setFilteredDoctors(result)
  }, [searchTerm, statusFilter, specialtyFilter, doctors])

  // Handle doctor deletion
  const handleDeleteDoctor = async () => {
    if (selectedDoctor) {
      try {
        setIsDeleting(true)

        // Try to delete from doctors collection first
        try {
          await deleteDoc(doc(db, "doctors", selectedDoctor.id))
          console.log("Doctor deleted from doctors collection")
        } catch (error) {
          console.log("Doctor not found in doctors collection or error:", error)

          // Try to delete from users collection
          try {
            await deleteDoc(doc(db, "users", selectedDoctor.id))
            console.log("Doctor deleted from users collection")
          } catch (userError) {
            console.error("Failed to delete doctor from users collection:", userError)
            throw new Error("Failed to delete doctor from any collection")
          }
        }

        // Update local state
        const updatedDoctors = doctors.filter((doctor) => doctor.id !== selectedDoctor.id)
        setDoctors(updatedDoctors)
        setFilteredDoctors(
          updatedDoctors.filter((doctor) => {
            let match = true
            if (statusFilter !== "all") {
              match = match && doctor.status === statusFilter
            }
            if (specialtyFilter !== "all") {
              match = match && doctor.specialty === specialtyFilter
            }
            return match
          }),
        )

        // Update stats
        setStats({
          ...stats,
          total: stats.total - 1,
          active: selectedDoctor.status === "active" ? stats.active - 1 : stats.active,
          inactive: selectedDoctor.status === "inactive" ? stats.inactive - 1 : stats.inactive,
        })

        setShowDeleteModal(false)
        setSelectedDoctor(null)
        setDeleteSuccess(true)

        // Hide success message after 3 seconds
        setTimeout(() => {
          setDeleteSuccess(false)
        }, 3000)
      } catch (error) {
        console.error("Error deleting doctor:", error)
        setDeleteError(error.message)

        // Hide error message after 3 seconds
        setTimeout(() => {
          setDeleteError(null)
        }, 3000)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  // Handle doctor deactivation
  const handleDeactivateDoctor = async () => {
    if (selectedDoctor) {
      try {
        setIsUpdating(true)
        const newStatus = selectedDoctor.status === "active" ? "inactive" : "active"

        // Try to update in doctors collection first
        try {
          await updateDoc(doc(db, "doctors", selectedDoctor.id), {
            status: newStatus,
          })
          console.log("Doctor status updated in doctors collection")
        } catch (error) {
          console.log("Doctor not found in doctors collection or error:", error)

          // Try to update in users collection
          try {
            await updateDoc(doc(db, "users", selectedDoctor.id), {
              status: newStatus,
            })
            console.log("Doctor status updated in users collection")
          } catch (userError) {
            console.error("Failed to update doctor status in users collection:", userError)
            throw new Error("Failed to update doctor status in any collection")
          }
        }

        // Update local state
        const updatedDoctors = doctors.map((doctor) => {
          if (doctor.id === selectedDoctor.id) {
            return { ...doctor, status: newStatus }
          }
          return doctor
        })

        setDoctors(updatedDoctors)
        setFilteredDoctors(
          updatedDoctors.filter((doctor) => {
            let match = true
            if (statusFilter !== "all") {
              match = match && doctor.status === statusFilter
            }
            if (specialtyFilter !== "all") {
              match = match && doctor.specialty === specialtyFilter
            }
            return match
          }),
        )

        // Update stats
        if (newStatus === "active") {
          setStats({
            ...stats,
            active: stats.active + 1,
            inactive: stats.inactive - 1,
          })
        } else {
          setStats({
            ...stats,
            active: stats.active - 1,
            inactive: stats.inactive + 1,
          })
        }

        setShowDeactivateModal(false)
        setSelectedDoctor(null)
        setUpdateSuccess(true)

        // Hide success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false)
        }, 3000)
      } catch (error) {
        console.error("Error updating doctor status:", error)
        setUpdateError(error.message)

        // Hide error message after 3 seconds
        setTimeout(() => {
          setUpdateError(null)
        }, 3000)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="animate-pulse w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gray-200 h-8 w-48 rounded"></h1>
          <div className="bg-gray-200 h-10 w-32 rounded"></div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 w-full">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="bg-gray-200 h-10 w-full md:w-64 rounded"></div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="bg-gray-200 h-10 w-full md:w-48 rounded"></div>
              <div className="bg-gray-200 h-10 w-full md:w-48 rounded"></div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  {[...Array(6)].map((_, i) => (
                    <th key={i} className="py-3 px-4 border-b border-earth-beige">
                      <div className="bg-gray-200 h-6 w-full rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="py-4 px-4 border-b border-earth-beige">
                        <div className="bg-gray-200 h-6 w-full rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <AdminHeaderBanner
        title="Doctors Management"
        subtitle="Manage your healthcare providers"
        stats={[
          {
            icon: <Users className="h-5 w-5 text-white/70" />,
            label: "Total Doctors",
            value: stats.total,
          },
          {
            icon: <UserCheck className="h-5 w-5 text-white/70" />,
            label: "Active",
            value: stats.active,
          },
          {
            icon: <UserMinus className="h-5 w-5 text-white/70" />,
            label: "Inactive",
            value: stats.inactive,
          },
          {
            icon: <UserPlus className="h-5 w-5 text-white/70" />,
            label: "New (7 days)",
            value: stats.new,
          },
        ]}
      />

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 w-full">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search doctors..."
              className="w-full pl-10 pr-4 py-2 border border-earth-beige rounded-md focus:outline-none focus:ring-1 focus:ring-soft-amber"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-drift-gray" />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <select
                className="w-full pl-10 pr-4 py-2 border border-earth-beige rounded-md focus:outline-none focus:ring-1 focus:ring-soft-amber appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-drift-gray" />
            </div>

            <div className="relative w-full md:w-48">
              <select
                className="w-full pl-10 pr-4 py-2 border border-earth-beige rounded-md focus:outline-none focus:ring-1 focus:ring-soft-amber appearance-none"
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
              >
                <option value="all">All Specialties</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-drift-gray" />
            </div>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-drift-gray border-b border-earth-beige">
                  Doctor
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-drift-gray border-b border-earth-beige">
                  Specialty
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-drift-gray border-b border-earth-beige">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-drift-gray border-b border-earth-beige">
                  Last Login
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-drift-gray border-b border-earth-beige">
                  Status
                </th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-drift-gray border-b border-earth-beige">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="hover:bg-pale-stone/50 cursor-pointer"
                    onClick={() => router.push(`/admin/doctors/${doctor.id}`)}
                  >
                    <td className="py-4 px-4 border-b border-earth-beige">
                      <div className="flex items-center">
                        <img
                          src={doctor.avatar || "/placeholder.svg?height=40&width=40"}
                          alt={doctor.name}
                          className="h-10 w-10 rounded-full mr-3"
                        />
                        <span className="font-medium text-graphite">{doctor.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 border-b border-earth-beige text-drift-gray">{doctor.specialty}</td>
                    <td className="py-4 px-4 border-b border-earth-beige text-drift-gray">{doctor.email}</td>
                    <td className="py-4 px-4 border-b border-earth-beige text-drift-gray">{doctor.lastLogin}</td>
                    <td className="py-4 px-4 border-b border-earth-beige">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doctor.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {doctor.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4 border-b border-earth-beige text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/admin/doctors/${doctor.id}`)
                          }}
                          className="p-1 rounded-full hover:bg-pale-stone text-drift-gray"
                          aria-label="View doctor details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDoctor(doctor)
                            setShowDeactivateModal(true)
                          }}
                          className="p-1 rounded-full hover:bg-pale-stone text-drift-gray"
                          aria-label={doctor.status === "active" ? "Deactivate doctor" : "Activate doctor"}
                        >
                          <UserX className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDoctor(doctor)
                            setShowDeleteModal(true)
                          }}
                          className="p-1 rounded-full hover:bg-pale-stone text-drift-gray"
                          aria-label="Delete doctor"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-drift-gray border-b border-earth-beige">
                    No doctors found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-drift-gray">
            Showing <span className="font-medium">{filteredDoctors.length}</span> of{" "}
            <span className="font-medium">{doctors.length}</span> doctors
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border border-earth-beige rounded-md text-drift-gray hover:bg-pale-stone disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 bg-soft-amber text-white rounded-md hover:bg-soft-amber/90">1</button>
            <button className="px-3 py-1 border border-earth-beige rounded-md text-drift-gray hover:bg-pale-stone">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-graphite mb-2">Delete Doctor</h3>
            <p className="text-drift-gray mb-4">
              Are you sure you want to delete {selectedDoctor?.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-earth-beige rounded-md text-drift-gray hover:bg-pale-stone"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDoctor}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-graphite mb-2">
              {selectedDoctor?.status === "active" ? "Deactivate" : "Activate"} Doctor
            </h3>
            <p className="text-drift-gray mb-4">
              Are you sure you want to {selectedDoctor?.status === "active" ? "deactivate" : "activate"}{" "}
              {selectedDoctor?.name}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 border border-earth-beige rounded-md text-drift-gray hover:bg-pale-stone"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateDoctor}
                className={`px-4 py-2 text-white rounded-md flex items-center ${
                  selectedDoctor?.status === "active"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                    Updating...
                  </>
                ) : selectedDoctor?.status === "active" ? (
                  "Deactivate"
                ) : (
                  "Activate"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success and Error Notifications */}
      {deleteSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fadeIn">
          <div className="flex">
            <div className="py-1">
              <svg className="h-6 w-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Success</p>
              <p className="text-sm">Doctor has been successfully deleted.</p>
            </div>
          </div>
        </div>
      )}

      {updateSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fadeIn">
          <div className="flex">
            <div className="py-1">
              <svg className="h-6 w-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Success</p>
              <p className="text-sm">Doctor status has been successfully updated.</p>
            </div>
          </div>
        </div>
      )}

      {deleteError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50 animate-fadeIn">
          <div className="flex">
            <div className="py-1">
              <svg className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">Failed to delete doctor: {deleteError}</p>
            </div>
          </div>
        </div>
      )}

      {updateError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50 animate-fadeIn">
          <div className="flex">
            <div className="py-1">
              <svg className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">Failed to update doctor status: {updateError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
