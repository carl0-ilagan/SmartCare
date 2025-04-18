"use client"

import { useState } from "react"
import { Camera, Mail, Phone, User } from "lucide-react"
import { SaveConfirmationModal } from "@/components/save-confirmation-modal"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "patient@example.com",
    phone: "+1 (555) 123-4567",
    dob: "1985-06-15",
    gender: "Male",
    address: "123 Main Street, Anytown, CA 12345",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1 (555) 987-6543",
    bloodType: "O+",
    allergies: "Penicillin",
    medicalConditions: "Hypertension, Asthma",
    currentMedications: "Lisinopril, Albuterol",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsEditing(false)
    setShowSaveModal(true)
    // In a real app, this would save to the backend
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite md:text-3xl">My Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Photo */}
        <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="h-32 w-32 overflow-hidden rounded-full bg-pale-stone">
                <User className="h-full w-full p-6 text-drift-gray" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 rounded-full bg-soft-amber p-2 text-white shadow-sm hover:bg-amber-600">
                  <Camera className="h-5 w-5" />
                  <span className="sr-only">Change photo</span>
                </button>
              )}
            </div>
            <h2 className="text-xl font-semibold text-graphite">{profile.name}</h2>
            <p className="text-drift-gray">Patient</p>
            <div className="mt-4 flex items-center space-x-2">
              <Mail className="h-4 w-4 text-drift-gray" />
              <span className="text-sm text-drift-gray">{profile.email}</span>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <Phone className="h-4 w-4 text-drift-gray" />
              <span className="text-sm text-drift-gray">{profile.phone}</span>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="col-span-2 rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-graphite">Personal Information</h2>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-graphite">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-graphite">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-graphite">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-graphite">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={profile.dob}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-graphite">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bloodType" className="block text-sm font-medium text-graphite">
                    Blood Type
                  </label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={profile.bloodType}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-graphite">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-graphite">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={profile.emergencyContact}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
                <div>
                  <label htmlFor="emergencyPhone" className="block text-sm font-medium text-graphite">
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    id="emergencyPhone"
                    name="emergencyPhone"
                    value={profile.emergencyPhone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="allergies" className="block text-sm font-medium text-graphite">
                  Allergies
                </label>
                <input
                  type="text"
                  id="allergies"
                  name="allergies"
                  value={profile.allergies}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                />
              </div>

              <div>
                <label htmlFor="medicalConditions" className="block text-sm font-medium text-graphite">
                  Medical Conditions
                </label>
                <textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  value={profile.medicalConditions}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                />
              </div>

              <div>
                <label htmlFor="currentMedications" className="block text-sm font-medium text-graphite">
                  Current Medications
                </label>
                <textarea
                  id="currentMedications"
                  name="currentMedications"
                  value={profile.currentMedications}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite shadow-sm transition-colors hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-drift-gray">Full Name</h3>
                  <p className="text-graphite">{profile.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-drift-gray">Email</h3>
                  <p className="text-graphite">{profile.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-drift-gray">Phone</h3>
                  <p className="text-graphite">{profile.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-drift-gray">Date of Birth</h3>
                  <p className="text-graphite">{new Date(profile.dob).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-drift-gray">Gender</h3>
                  <p className="text-graphite">{profile.gender}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-drift-gray">Blood Type</h3>
                  <p className="text-graphite">{profile.bloodType}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-drift-gray">Address</h3>
                <p className="text-graphite">{profile.address}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-drift-gray">Emergency Contact</h3>
                  <p className="text-graphite">{profile.emergencyContact}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-drift-gray">Emergency Phone</h3>
                  <p className="text-graphite">{profile.emergencyPhone}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-drift-gray">Allergies</h3>
                <p className="text-graphite">{profile.allergies || "None"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-drift-gray">Medical Conditions</h3>
                <p className="text-graphite">{profile.medicalConditions || "None"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-drift-gray">Current Medications</h3>
                <p className="text-graphite">{profile.currentMedications || "None"}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <SaveConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Profile Updated"
        message="Your profile information has been successfully updated."
      />
    </div>
  )
}
