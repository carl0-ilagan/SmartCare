"use client"

import { useState } from "react"
import { Camera, Mail, Phone, User } from "lucide-react"

export default function DoctorProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Dr. Sarah Johnson",
    email: "doctor@example.com",
    phone: "+1 (555) 987-6543",
    specialty: "Cardiologist",
    licenseNumber: "MD12345678",
    education: "Harvard Medical School",
    experience: "15+ years",
    languages: "English, Spanish",
    bio: "Dr. Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She specializes in preventive cardiology and heart failure management.",
    officeAddress: "456 Medical Center Blvd, Suite 200, Anytown, CA 12345",
    officeHours: "Monday-Friday: 9am-5pm",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsEditing(false)
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
            <p className="text-soft-amber">{profile.specialty}</p>
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
          <h2 className="mb-4 text-xl font-semibold text-graphite">Professional Information</h2>

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
                  <label htmlFor="specialty" className="block text-sm font-medium text-graphite">
                    Specialty
                  </label>
                  <input
                    type="text"
                    id="specialty"
                    name="specialty"
                    value={profile.specialty}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-graphite">
                    License Number
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={profile.licenseNumber}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-graphite">
                    Education
                  </label>
                  <input
                    type="text"
                    id="education"
                    name="education"
                    value={profile.education}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-graphite">
                    Experience
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
                <div>
                  <label htmlFor="languages" className="block text-sm font-medium text-graphite">
                    Languages
                  </label>
                  <input
                    type="text"
                    id="languages"
                    name="languages"
                    value={profile.languages}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-graphite">
                  Professional Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                />
              </div>

              <div>
                <label htmlFor="officeAddress" className="block text-sm font-medium text-graphite">
                  Office Address
                </label>
                <input
                  type="text"
                  id="officeAddress"
                  name="officeAddress"
                  value={profile.officeAddress}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-earth-beige p-2 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                />
              </div>

              <div>
                <label htmlFor="officeHours" className="block text-sm font-medium text-graphite">
                  Office Hours
                </label>
                <input
                  type="text"
                  id="officeHours"
                  name="officeHours"
                  value={profile.officeHours}
                  onChange={handleChange}
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
                  <h3 className="text-sm font-medium text-drift-gray">Specialty</h3>
                  <p className="text-graphite">{profile.specialty}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-drift-gray">License Number</h3>
                  <p className="text-graphite">{profile.licenseNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-drift-gray">Education</h3>
                  <p className="text-graphite">{profile.education}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-drift-gray">Experience</h3>
                  <p className="text-graphite">{profile.experience}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-drift-gray">Languages</h3>
                  <p className="text-graphite">{profile.languages}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-drift-gray">Professional Bio</h3>
                <p className="text-graphite">{profile.bio}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-drift-gray">Office Address</h3>
                <p className="text-graphite">{profile.officeAddress}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-drift-gray">Office Hours</h3>
                <p className="text-graphite">{profile.officeHours}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
