"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, ChevronDown, ChevronUp, Download, FileText, Filter, Plus, Search, User } from "lucide-react"

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Mock patient data
  const patients = [
    {
      id: 1,
      name: "John Doe",
      age: 45,
      gender: "Male",
      lastVisit: "2023-06-01",
      nextAppointment: "2023-06-15",
      condition: "Hypertension",
      status: "active",
    },
    {
      id: 2,
      name: "Emily Johnson",
      age: 32,
      gender: "Female",
      lastVisit: "2023-05-20",
      nextAppointment: "2023-06-20",
      condition: "Diabetes Type 2",
      status: "active",
    },
    {
      id: 3,
      name: "Michael Brown",
      age: 58,
      gender: "Male",
      lastVisit: "2023-05-15",
      nextAppointment: null,
      condition: "Arthritis",
      status: "inactive",
    },
    {
      id: 4,
      name: "Sarah Davis",
      age: 27,
      gender: "Female",
      lastVisit: "2023-05-10",
      nextAppointment: "2023-06-10",
      condition: "Asthma",
      status: "active",
    },
    {
      id: 5,
      name: "Robert Wilson",
      age: 62,
      gender: "Male",
      lastVisit: "2023-04-28",
      nextAppointment: "2023-06-28",
      condition: "Coronary Artery Disease",
      status: "active",
    },
    {
      id: 6,
      name: "Jennifer Martinez",
      age: 41,
      gender: "Female",
      lastVisit: "2023-05-05",
      nextAppointment: null,
      condition: "Migraine",
      status: "inactive",
    },
    {
      id: 7,
      name: "David Thompson",
      age: 53,
      gender: "Male",
      lastVisit: "2023-05-18",
      nextAppointment: "2023-06-18",
      condition: "COPD",
      status: "active",
    },
  ]

  // Filter and sort patients
  const filteredPatients = patients
    .filter((patient) => {
      // Filter by search term
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by status
      const matchesStatus = filterStatus === "all" || patient.status === filterStatus

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Sort by selected field
      let comparison = 0

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "age") {
        comparison = a.age - b.age
      } else if (sortBy === "lastVisit") {
        comparison = new Date(a.lastVisit) - new Date(b.lastVisit)
      }

      // Apply sort order
      return sortOrder === "asc" ? comparison : -comparison
    })

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // Set new sort field and default to ascending
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite md:text-3xl">Patients</h1>
        <Link
          href="/doctor/patients/add"
          className="inline-flex items-center rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Link>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
          <input
            type="text"
            placeholder="Search patients by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center rounded-md border border-earth-beige bg-white px-4 py-2 text-sm font-medium text-graphite shadow-sm transition-colors hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-earth-beige focus:ring-offset-2"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </button>
      </div>

      {showFilters && (
        <div className="rounded-lg border border-earth-beige bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-graphite">
                Status
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mt-1 rounded-md border border-earth-beige bg-white py-1 pl-3 pr-10 text-sm text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-graphite">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 rounded-md border border-earth-beige bg-white py-1 pl-3 pr-10 text-sm text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              >
                <option value="name">Name</option>
                <option value="age">Age</option>
                <option value="lastVisit">Last Visit</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-graphite">
                Order
              </label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="mt-1 rounded-md border border-earth-beige bg-white py-1 pl-3 pr-10 text-sm text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-pale-stone bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pale-stone bg-pale-stone text-left text-sm font-medium text-graphite">
                <th className="px-4 py-3">
                  <button onClick={() => handleSort("name")} className="inline-flex items-center">
                    Patient
                    {sortBy === "name" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button onClick={() => handleSort("age")} className="inline-flex items-center">
                    Age
                    {sortBy === "age" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">
                  <button onClick={() => handleSort("lastVisit")} className="inline-flex items-center">
                    Last Visit
                    {sortBy === "lastVisit" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3">Next Appointment</th>
                <th className="px-4 py-3">Condition</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-pale-stone hover:bg-pale-stone/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-pale-stone">
                          <User className="h-full w-full p-1.5 text-drift-gray" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-graphite">{patient.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-drift-gray">{patient.age}</td>
                    <td className="px-4 py-3 text-drift-gray">{patient.gender}</td>
                    <td className="px-4 py-3 text-drift-gray">{new Date(patient.lastVisit).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-drift-gray">
                      {patient.nextAppointment ? (
                        new Date(patient.nextAppointment).toLocaleDateString()
                      ) : (
                        <span className="text-red-500">Not Scheduled</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-drift-gray">{patient.condition}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          patient.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {patient.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Link
                          href={`/doctor/patients/${patient.id}`}
                          className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                          title="View Patient"
                        >
                          <User className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                        <Link
                          href={`/doctor/patients/${patient.id}/appointments`}
                          className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                          title="Schedule Appointment"
                        >
                          <Calendar className="h-4 w-4" />
                          <span className="sr-only">Schedule</span>
                        </Link>
                        <Link
                          href={`/doctor/patients/${patient.id}/records`}
                          className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                          title="Medical Records"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Records</span>
                        </Link>
                        <button
                          className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                          title="Export Patient Data"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Export</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-drift-gray">
                    No patients found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
