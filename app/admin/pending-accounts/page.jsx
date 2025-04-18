"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Clock, Calendar, User } from "lucide-react"
import { getPendingApprovals } from "@/lib/firebase"

export default function PendingAccountsPage() {
  const [pendingAccounts, setPendingAccounts] = useState([])
  const [filteredAccounts, setFilteredAccounts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  // Fetch pending accounts data
  useEffect(() => {
    const fetchPendingAccounts = async () => {
      setIsLoading(true)
      try {
        const result = await getPendingApprovals()
        if (result.success) {
          setPendingAccounts(result.pendingUsers || [])
          setFilteredAccounts(result.pendingUsers || [])
        } else {
          console.error("Error fetching pending accounts:", result.error)
        }
      } catch (error) {
        console.error("Error in fetchPendingAccounts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPendingAccounts()
  }, [])

  // Handle search and filter
  useEffect(() => {
    let result = pendingAccounts

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (account) =>
          account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter((account) => account.userType === roleFilter)
    }

    setFilteredAccounts(result)
  }, [searchTerm, roleFilter, pendingAccounts])

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="animate-pulse w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gray-200 h-8 w-64 rounded"></h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 w-full">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="bg-gray-200 h-10 w-full md:w-64 rounded"></div>
            <div className="bg-gray-200 h-10 w-full md:w-48 rounded"></div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  {[...Array(5)].map((_, i) => (
                    <th key={i} className="py-3 px-4 border-b border-earth-beige">
                      <div className="bg-gray-200 h-6 w-full rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-graphite">
          Recent Account Registrations{" "}
          <span className="bg-blue-500 text-white text-sm px-2 py-0.5 rounded-full ml-2">{pendingAccounts.length}</span>
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 w-full">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search accounts..."
              className="w-full pl-10 pr-4 py-2 border border-earth-beige rounded-md focus:outline-none focus:ring-1 focus:ring-soft-amber"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-drift-gray" />
          </div>

          <div className="relative w-full md:w-48">
            <select
              className="w-full pl-10 pr-4 py-2 border border-earth-beige rounded-md focus:outline-none focus:ring-1 focus:ring-soft-amber appearance-none"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="patient">Patients</option>
              <option value="doctor">Doctors</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-drift-gray" />
          </div>
        </div>

        {/* Accounts Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-drift-gray border-b border-earth-beige">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-drift-gray border-b border-earth-beige">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-drift-gray border-b border-earth-beige">
                  Role
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-drift-gray border-b border-earth-beige">
                  Created Date
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-drift-gray border-b border-earth-beige">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <tr key={account.uid} className="hover:bg-pale-stone/50">
                    <td className="py-4 px-4 border-b border-earth-beige">
                      <div className="flex items-center">
                        <img
                          src={account.photoURL || "/placeholder.svg?height=40&width=40"}
                          alt={account.name}
                          className="h-10 w-10 rounded-full mr-3"
                        />
                        <span className="font-medium text-graphite">{account.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 border-b border-earth-beige text-drift-gray">{account.email}</td>
                    <td className="py-4 px-4 border-b border-earth-beige">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          account.userType === "doctor" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {account.userType === "doctor" ? (
                          <>
                            <User className="h-3 w-3 mr-1" />
                            Doctor
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3 mr-1" />
                            Patient
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4 border-b border-earth-beige text-drift-gray">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-drift-gray" />
                        {formatDate(account.createdAt || account.requestedAt)}
                      </div>
                    </td>
                    <td className="py-4 px-4 border-b border-earth-beige">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-drift-gray border-b border-earth-beige">
                    No accounts found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-drift-gray">
            Showing <span className="font-medium">{filteredAccounts.length}</span> of{" "}
            <span className="font-medium">{pendingAccounts.length}</span> accounts
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
              2
            </button>
            <button className="px-3 py-1 border border-earth-beige rounded-md text-drift-gray hover:bg-pale-stone">
              3
            </button>
            <button className="px-3 py-1 border border-earth-beige rounded-md text-drift-gray hover:bg-pale-stone">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
