"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, Mail, Phone, Briefcase, GraduationCap, Globe, MapPin, Clock, FileText } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUserProfile, updateUserProfile, uploadProfilePhoto } from "@/lib/firebase-utils"
import { SaveConfirmationModal } from "@/components/save-confirmation-modal"
import ProfileImage from "@/components/profile-image"

export default function DoctorProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    phone: "",
    specialty: "",
    licenseNumber: "",
    education: "",
    experience: "",
    languages: "",
    bio: "",
    officeAddress: "",
    officeHours: "",
    photoURL: "",
  })

  // Fetch user profile data
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) return

      try {
        setLoading(true)
        const userData = await getUserProfile(user.uid)
        if (userData) {
          setProfile({
            displayName: userData.displayName || user.displayName || "",
            email: userData.email || user.email || "",
            phone: userData.phone || "",
            specialty: userData.specialty || "",
            licenseNumber: userData.licenseNumber || "",
            education: userData.education || "",
            experience: userData.experience || "",
            languages: userData.languages || "",
            bio: userData.bio || "",
            officeAddress: userData.officeAddress || "",
            officeHours: userData.officeHours || "",
            photoURL: userData.photoURL || user.photoURL || "",
          })
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = async (e) => {
    if (!user || !e.target.files || !e.target.files[0]) return

    try {
      const file = e.target.files[0]
      const photoURL = await uploadProfilePhoto(user.uid, file)
      setProfile((prev) => ({ ...prev, photoURL }))
    } catch (err) {
      console.error("Error uploading photo:", err)
      setError("Failed to upload photo")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)
      await updateUserProfile(user.uid, {
        displayName: profile.displayName,
        phone: profile.phone,
        specialty: profile.specialty,
        licenseNumber: profile.licenseNumber,
        education: profile.education,
        experience: profile.experience,
        languages: profile.languages,
        bio: profile.bio,
        officeAddress: profile.officeAddress,
        officeHours: profile.officeHours,
      })
      setIsEditing(false)
      setShowSaveModal(true)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !profile.displayName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 md:h-28 md:w-28 overflow-hidden rounded-full border-4 border-white/30 shadow-lg">
                <ProfileImage
                  src={profile.photoURL}
                  alt={profile.displayName || "Profile"}
                  className="h-full w-full"
                  role="doctor"
                />
              </div>
              {isEditing && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    className="absolute bottom-0 right-0 rounded-full bg-white p-2 text-amber-500 shadow-sm hover:bg-gray-100 transition-colors"
                    onClick={handlePhotoClick}
                  >
                    <Camera className="h-5 w-5" />
                    <span className="sr-only">Change photo</span>
                  </button>
                </>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold sm:text-3xl">{profile.displayName || "Doctor Profile"}</h1>
                <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                  Doctor
                </span>
              </div>
              <div className="mt-1">
                <span className="inline-flex items-center rounded-full bg-white/30 px-2.5 py-0.5 text-sm font-medium text-white backdrop-blur-sm">
                  {profile.specialty || "Medical Professional"}
                </span>
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                {profile.email && (
                  <div className="flex items-center text-white/90">
                    <Mail className="mr-1 h-4 w-4" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center text-white/90">
                    <Phone className="mr-1 h-4 w-4" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`self-start md:self-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isEditing
                ? "bg-white text-amber-500 hover:bg-gray-100 focus:ring-white"
                : "bg-white/20 text-white hover:bg-white/30 focus:ring-white/50 backdrop-blur-sm"
            }`}
            disabled={loading}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-32 right-16 h-48 w-48 rounded-full bg-white/5"></div>
      </div>

      {isEditing ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-800 flex items-center">
            <span>Edit Professional Information</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={profile.displayName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2.5 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled
                  className="w-full rounded-md border border-gray-300 p-2.5 bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2.5 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty
                </label>
                <input
                  type="text"
                  id="specialty"
                  name="specialty"
                  value={profile.specialty}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2.5 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={profile.licenseNumber}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2.5 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                  Education
                </label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={profile.education}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2.5 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2.5 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="languages" className="block text-sm font-medium text-gray-700 mb-1">
                  Languages
                </label>
                <input
                  type="text"
                  id="languages"
                  name="languages"
                  value={profile.languages}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2.5 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Professional Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 p-2.5 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label htmlFor="officeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Office Address
              </label>
              <input
                type="text"
                id="officeAddress"
                name="officeAddress"
                value={profile.officeAddress}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2.5 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label htmlFor="officeHours" className="block text-sm font-medium text-gray-700 mb-1">
                Office Hours
              </label>
              <input
                type="text"
                id="officeHours"
                name="officeHours"
                value={profile.officeHours}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2.5 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-amber-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1">
          {/* Professional Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
              Professional Information
            </h3>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="flex items-start">
                  <Briefcase className="h-5 w-5 text-amber-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Specialty</p>
                    <p className="text-gray-800 text-lg">{profile.specialty || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-amber-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">License Number</p>
                    <p className="text-gray-800 text-lg">{profile.licenseNumber || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <GraduationCap className="h-5 w-5 text-amber-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Education</p>
                    <p className="text-gray-800 text-lg">{profile.education || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Briefcase className="h-5 w-5 text-amber-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Experience</p>
                    <p className="text-gray-800 text-lg">{profile.experience || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-amber-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Languages</p>
                    <p className="text-gray-800 text-lg">{profile.languages || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
              Contact Information
            </h3>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-amber-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                    <p className="text-gray-800 text-lg">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-amber-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                    <p className="text-gray-800 text-lg">{profile.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-amber-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Office Address</p>
                    <p className="text-gray-800 text-lg">{profile.officeAddress || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-amber-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Office Hours</p>
                    <p className="text-gray-800 text-lg">{profile.officeHours || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Bio */}
          {profile.bio && (
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                Professional Bio
              </h3>

              <div className="flex items-start">
                <FileText className="h-5 w-5 text-amber-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 text-lg whitespace-pre-line">{profile.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <SaveConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Profile Updated"
        message="Your profile information has been successfully updated."
      />
    </div>
  )
}
