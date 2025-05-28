"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Search, X, ChevronDown } from "lucide-react"
import { searchDoctors, getSpecialties } from "@/lib/search-utils"
import { AppointmentModal } from "@/components/appointment-modal"
import { useMobile } from "@/hooks/use-mobile"

export function DoctorSearch({ onClose, isOverlay = false }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [specialties, setSpecialties] = useState([])
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [lastDoc, setLastDoc] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState(null)

  const searchInputRef = useRef(null)
  const searchResultsRef = useRef(null)
  const isMobile = useMobile()

  // Fetch specialties on component mount
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const specialtiesList = await getSpecialties()
        setSpecialties(specialtiesList)
      } catch (err) {
        console.error("Error fetching specialties:", err)
        setError("Failed to load specialties")
      }
    }

    fetchSpecialties()
  }, [])

  // Focus search input when component mounts (for overlay mode)
  useEffect(() => {
    if (isOverlay && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100)
    }
  }, [isOverlay])

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showResults &&
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target) &&
        !searchInputRef.current?.contains(event.target)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showResults])

  const handleSearch = async (e) => {
    if (e) e.preventDefault()

    setError(null)
    setShowResults(true)
    setIsSearching(true)

    console.log("Searching for:", searchTerm, "Specialty:", selectedSpecialty)

    try {
      const filters = {
        specialty: selectedSpecialty,
      }

      const { doctors, lastDoc: newLastDoc, hasMore: moreResults } = await searchDoctors(searchTerm, filters)

      console.log("Search results:", doctors.length, "doctors found")

      setSearchResults(doctors)
      setLastDoc(newLastDoc)
      setHasMore(moreResults)
    } catch (err) {
      console.error("Error in search:", err)
      setError("An error occurred while searching")
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleLoadMore = async () => {
    if (!lastDoc || !hasMore) return

    setIsSearching(true)
    setError(null)

    try {
      const filters = {
        specialty: selectedSpecialty,
      }

      const { doctors, lastDoc: newLastDoc, hasMore: moreResults } = await searchDoctors(searchTerm, filters, lastDoc)

      setSearchResults((prev) => [...prev, ...doctors])
      setLastDoc(newLastDoc)
      setHasMore(moreResults)
    } catch (err) {
      console.error("Error loading more doctors:", err)
      setError("Failed to load more results")
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSelectedSpecialty("")
    setSearchResults([])
    setShowResults(false)
    setError(null)
  }

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor)
    setIsAppointmentModalOpen(true)
    if (isOverlay && onClose) {
      onClose()
    } else {
      setShowResults(false)
    }
  }

  // Render different search UI based on isOverlay prop
  if (isOverlay) {
    return (
      <>
        <div className="p-4 bg-amber-50 border-b border-pale-stone">
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialty"
                  className="w-full rounded-md border border-pale-stone py-2 pl-10 pr-4 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 sm:w-auto"
              >
                Search
              </button>
            </div>
          </form>

          {/* Mobile Search Results */}
          <div className="max-h-[60vh] overflow-y-auto" ref={searchResultsRef}>
            {error && <div className="p-4 bg-red-50 border-b border-red-200 text-red-600 text-center">{error}</div>}

            {isSearching ? (
              <div className="flex justify-center p-6">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                <div className="px-4 py-2 bg-pale-stone">
                  <p className="text-sm text-drift-gray">
                    Found {searchResults.length} doctor{searchResults.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="p-2">
                  {searchResults.map((doctor) => (
                    <div key={doctor.id} className="border-b border-pale-stone last:border-0">
                      <div className="flex items-center p-3 space-x-3">
                        <div className="relative h-12 w-12 flex-shrink-0">
                          {doctor.photoURL ? (
                            <img
                              src={doctor.photoURL || "/placeholder.svg"}
                              alt={doctor.displayName}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-amber-500 text-white">
                              <span className="text-lg font-bold">{doctor.displayName.charAt(0)}</span>
                            </div>
                          )}
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${doctor.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                          ></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/dashboard/doctors/${doctor.id}`}
                            className="font-medium text-graphite hover:text-amber-500 block"
                            onClick={onClose}
                          >
                            {doctor.displayName}
                          </Link>
                          <p className="text-sm text-drift-gray truncate">{doctor.specialty}</p>
                        </div>

                        <button
                          onClick={() => handleBookAppointment(doctor)}
                          className="rounded-md bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}

                  {hasMore && (
                    <div className="p-4 flex justify-center">
                      <button
                        onClick={handleLoadMore}
                        className="rounded-md border border-amber-500 px-4 py-2 text-amber-500 hover:bg-amber-50"
                        disabled={isSearching}
                      >
                        {isSearching ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : searchTerm || selectedSpecialty ? (
              <div className="p-6 text-center">
                <p className="text-drift-gray">No doctors found matching your search</p>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-drift-gray">Search for doctors by name, specialty, or location</p>
              </div>
            )}
          </div>

          {/* Appointment Modal */}
          <AppointmentModal
            isOpen={isAppointmentModalOpen}
            onClose={() => setIsAppointmentModalOpen(false)}
            userRole="patient"
            selectedDoctor={selectedDoctor ? { id: selectedDoctor.id, name: selectedDoctor.displayName } : null}
          />
        </div>
      </>
    )
  }

  // Desktop/inline search
  return (
    <>
      <div className="relative">
        <form onSubmit={handleSearch} className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search doctors..."
            className="w-40 rounded-full border border-pale-stone bg-pale-stone py-1.5 pl-8 pr-8 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 md:w-48"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowResults(true)
              }
            }}
          />
          <Search
            className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray cursor-pointer"
            onClick={handleSearch}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray hover:text-graphite"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Desktop Search Results Dropdown */}
        {showResults && (
          <div
            ref={searchResultsRef}
            className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto rounded-md border border-pale-stone bg-white shadow-lg z-50"
          >
            <div className="sticky top-0 bg-amber-50 p-3 border-b border-pale-stone">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-graphite">Doctor Search Results</h3>
                <div className="relative">
                  <select
                    className="appearance-none rounded-md border border-pale-stone py-1 pl-2 pr-6 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={selectedSpecialty}
                    onChange={(e) => {
                      setSelectedSpecialty(e.target.value)
                      handleSearch()
                    }}
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 pointer-events-none text-drift-gray" />
                </div>
              </div>
              <p className="text-xs text-drift-gray mt-1">
                {isSearching
                  ? "Searching..."
                  : searchResults.length > 0
                    ? `Found ${searchResults.length} doctor${searchResults.length > 1 ? "s" : ""}`
                    : "No doctors found"}
              </p>
            </div>

            {error && (
              <div className="p-2 bg-red-50 border-b border-red-200 text-red-600 text-xs text-center">{error}</div>
            )}

            {isSearching ? (
              <div className="flex justify-center p-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-2">
                {searchResults.map((doctor) => (
                  <div key={doctor.id} className="rounded-md p-2 hover:bg-pale-stone transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="relative h-10 w-10 flex-shrink-0">
                        {doctor.photoURL ? (
                          <img
                            src={doctor.photoURL || "/placeholder.svg"}
                            alt={doctor.displayName}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-amber-500 text-white">
                            <span className="text-sm font-bold">{doctor.displayName.charAt(0)}</span>
                          </div>
                        )}
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border border-white ${doctor.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                        ></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/dashboard/doctors/${doctor.id}`}
                          className="font-medium text-graphite hover:text-amber-500"
                          onClick={() => setShowResults(false)}
                        >
                          {doctor.displayName}
                        </Link>
                        <p className="text-xs text-drift-gray truncate">{doctor.specialty}</p>
                      </div>

                      <button
                        onClick={() => handleBookAppointment(doctor)}
                        className="rounded-md bg-amber-500 px-2 py-1 text-xs text-white hover:bg-amber-600"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <div className="p-2 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      className="rounded-md border border-amber-500 px-3 py-1 text-xs text-amber-500 hover:bg-amber-50 w-full"
                      disabled={isSearching}
                    >
                      {isSearching ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              searchTerm && (
                <div className="p-4 text-center">
                  <p className="text-drift-gray">No doctors found matching "{searchTerm}"</p>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        userRole="patient"
        selectedDoctor={selectedDoctor ? { id: selectedDoctor.id, name: selectedDoctor.displayName } : null}
      />
    </>
  )
}
