"use client"

import { useState, useEffect } from "react"
import { Star, Filter, ChevronDown, Calendar, X, Send, ArrowUpRight } from "lucide-react"
import { getAllFeedback, respondToFeedback } from "@/lib/feedback-utils"
import { SuccessNotification } from "@/components/success-notification"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import ProfileImage from "@/components/profile-image"

// This feedback page displays both user and admin profile images to:
// 1. Create a more personal and conversational experience
// 2. Help admins quickly identify who submitted feedback (patients vs doctors)
// 3. Provide accountability and personalization in admin responses
// 4. Maintain consistency with the chat-like interface used throughout the platform

export default function FeedbackSupportPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [feedbackItems, setFeedbackItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [notification, setNotification] = useState({ message: "", isVisible: false })
  const [lastVisible, setLastVisible] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [itemsPerPage] = useState(10)
  const [userProfiles, setUserProfiles] = useState({}) // Cache for user profiles

  // Filter states
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterDate, setFilterDate] = useState("all")
  const [responseText, setResponseText] = useState("")

  const [adminProfile, setAdminProfile] = useState({
    photoURL: "/admin-interface.png", // Default fallback image
    displayName: "Admin",
  })

  // Get admin profile - improved to handle auth delays and fetch from Firestore if needed
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        // First try to get from current auth
        const currentUser = auth.currentUser

        if (currentUser) {
          // If we have auth user but no photo, try to get from Firestore
          if (!currentUser.photoURL) {
            const userDoc = await getDoc(doc(db, "users", currentUser.uid))
            if (userDoc.exists() && userDoc.data().photoURL) {
              setAdminProfile({
                photoURL: userDoc.data().photoURL,
                displayName: currentUser.displayName || userDoc.data().displayName || "Admin",
              })
              return
            }
          } else {
            // We have auth user with photo
            setAdminProfile({
              photoURL: currentUser.photoURL,
              displayName: currentUser.displayName || "Admin",
            })
            return
          }
        }

        // If we reach here, we couldn't get a photo, so keep the default
      } catch (error) {
        console.error("Error fetching admin profile:", error)
        // Keep the default values on error
      }
    }

    fetchAdminProfile()
  }, [])

  // Load all feedback
  const loadFeedback = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setLastVisible(null)
      } else {
        setLoadingMore(true)
      }

      const result = await getAllFeedback(itemsPerPage, reset ? null : lastVisible)

      // Update the feedback items
      if (reset) {
        setFeedbackItems(result.feedback)
        setFilteredItems(result.feedback)
      } else {
        setFeedbackItems([...feedbackItems, ...result.feedback])
        setFilteredItems([...filteredItems, ...result.feedback])
      }

      setLastVisible(result.lastVisible)
      setHasMore(result.hasMore)

      // Fetch user profiles for all new feedback items
      const newFeedback = reset ? result.feedback : result.feedback
      const userIds = newFeedback.filter((item) => item.userId && !userProfiles[item.userId]).map((item) => item.userId)

      // Fetch unique user profiles
      const uniqueUserIds = [...new Set(userIds)]
      for (const userId of uniqueUserIds) {
        fetchUserProfileData(userId)
      }
    } catch (error) {
      console.error("Error loading feedback:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Load all feedback
  useEffect(() => {
    loadFeedback(true)
  }, [])

  // Fetch user profile data and store in cache
  const fetchUserProfileData = async (userId) => {
    if (!userId || userProfiles[userId]) return

    try {
      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        setUserProfiles((prev) => ({
          ...prev,
          [userId]: {
            photoURL: userData.photoURL || null,
            displayName: userData.displayName || userData.name || "User",
            email: userData.email || "",
            specialty: userData.specialty || "",
          },
        }))
      }
    } catch (error) {
      console.error(`Error fetching user profile:`, error)
    }
  }

  // Add this function to handle loading more items
  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      loadFeedback(false)
    }
  }

  // Apply filters when filter states change
  useEffect(() => {
    let filtered = [...feedbackItems]

    // Filter by user role (tab)
    if (activeTab !== "all") {
      filtered = filtered.filter((item) => item.userRole === activeTab)
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => item.status === filterStatus)
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType)
    }

    // Filter by date
    if (filterDate !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

      if (filterDate === "today") {
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.date).getTime()
          return itemDate >= today
        })
      } else if (filterDate === "week") {
        const weekAgo = today - 7 * 24 * 60 * 60 * 1000
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.date).getTime()
          return itemDate >= weekAgo
        })
      } else if (filterDate === "month") {
        const monthAgo = today - 30 * 24 * 60 * 60 * 1000
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.date).getTime()
          return itemDate >= monthAgo
        })
      }
    }

    setFilteredItems(filtered)
  }, [activeTab, filterStatus, filterType, filterDate, feedbackItems])

  // Handle sending response
  const handleSendResponse = async () => {
    if (!selectedTicket || !responseText.trim()) {
      setNotification({
        message: "Please enter a response",
        isVisible: true,
      })
      return
    }

    try {
      // Update in Firebase
      const updatedFeedback = await respondToFeedback(selectedTicket.id, responseText)

      // Update local state
      setFeedbackItems(feedbackItems.map((item) => (item.id === updatedFeedback.id ? updatedFeedback : item)))

      // Update filtered items
      setFilteredItems(filteredItems.map((item) => (item.id === updatedFeedback.id ? updatedFeedback : item)))

      // Update selected ticket
      setSelectedTicket(updatedFeedback)

      // Clear response text
      setResponseText("")

      // Show success notification
      setNotification({
        message: "Response sent successfully",
        isVisible: true,
      })
    } catch (error) {
      console.error("Error sending response:", error)
      setNotification({
        message: "There was an error sending your response. Please try again.",
        isVisible: true,
      })
    }
  }

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "responded":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Type badge color
  const getTypeColor = (type) => {
    switch (type) {
      case "general":
        return "bg-blue-100 text-blue-800"
      case "doctor":
      case "platform":
        return "bg-purple-100 text-purple-800"
      case "technical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Render stars for rating
  const renderStars = (rating) => {
    if (rating === null || rating === undefined) return <span className="text-xs text-drift-gray">No rating</span>

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-drift-gray"}`}
          />
        ))}
      </div>
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setFilterStatus("all")
    setFilterType("all")
    setFilterDate("all")
    loadFeedback(true) // Reset and reload feedback
  }

  // Count feedback by role
  const patientFeedbackCount = feedbackItems.filter((item) => item.userRole === "patient").length
  const doctorFeedbackCount = feedbackItems.filter((item) => item.userRole === "doctor").length
  const totalFeedbackCount = feedbackItems.length

  // Get user profile image
  const getUserProfileImage = (item) => {
    // If we have a cached profile, use it
    if (item.userId && userProfiles[item.userId]?.photoURL) {
      return userProfiles[item.userId].photoURL
    }

    // Otherwise use role-based default
    return item.userRole === "patient" ? "/patient-consultation.png" : "/caring-doctor.png"
  }

  // Handle selecting a ticket
  const handleSelectTicket = (item) => {
    setSelectedTicket(item)

    // If we don't have the user profile yet, fetch it
    if (item.userId && !userProfiles[item.userId]) {
      fetchUserProfileData(item.userId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-soft-amber/90 to-amber-500 p-6 shadow-md mb-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">User Feedback</h1>
            <p className="text-amber-50 mt-1">Manage and respond to feedback from patients and doctors</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-md border border-earth-beige hover:bg-pale-stone"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-earth-beige animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">Status</label>
              <select
                className="w-full p-2 border border-earth-beige rounded-md text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">Type</label>
              <select
                className="w-full p-2 border border-earth-beige rounded-md text-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="general">General</option>
                <option value="doctor">Doctor</option>
                <option value="platform">Platform</option>
                <option value="technical">Technical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">Date Range</label>
              <select
                className="w-full p-2 border border-earth-beige rounded-md text-sm"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-soft-amber text-white text-sm rounded-md hover:bg-soft-amber/90"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Tab Controls - Centered and interactive like patient/doctor info pages */}
      <div className="flex justify-center mb-6 mt-8 overflow-x-auto">
        <div className="flex p-1 bg-earth-beige/20 rounded-full shadow-sm">
          <button
            onClick={() => setActiveTab("all")}
            className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center ${
              activeTab === "all" ? "bg-soft-amber text-white shadow-sm" : "text-drift-gray hover:text-graphite"
            }`}
          >
            <span className="relative z-10">All Feedback</span>
            <span
              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                activeTab === "all" ? "bg-white/20 text-white" : "bg-soft-amber/10 text-soft-amber"
              }`}
            >
              {totalFeedbackCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("patient")}
            className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center ${
              activeTab === "patient" ? "bg-blue-500 text-white shadow-sm" : "text-drift-gray hover:text-graphite"
            }`}
          >
            <span className="relative z-10">Patient Feedback</span>
            <span
              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                activeTab === "patient" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
              }`}
            >
              {patientFeedbackCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("doctor")}
            className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center ${
              activeTab === "doctor" ? "bg-purple-500 text-white shadow-sm" : "text-drift-gray hover:text-graphite"
            }`}
          >
            <span className="relative z-10">Doctor Feedback</span>
            <span
              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                activeTab === "doctor" ? "bg-white/20 text-white" : "bg-purple-100 text-purple-600"
              }`}
            >
              {doctorFeedbackCount}
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* List of items */}
          <div className={`flex-1 ${selectedTicket ? "hidden md:block" : ""}`}>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber"></div>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="divide-y divide-earth-beige">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-pale-stone/50 cursor-pointer"
                    onClick={() => handleSelectTicket(item)}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-graphite">
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Feedback
                          </h3>
                          <span className="text-xs text-drift-gray">{item.date}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="h-5 w-5 rounded-full mr-2 overflow-hidden border border-earth-beige/50 flex-shrink-0">
                            <img
                              src={getUserProfileImage(item) || "/placeholder.svg"}
                              alt={item.userName || "User"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-drift-gray">
                            {(item.userId && userProfiles[item.userId]?.displayName) ||
                              item.userName ||
                              "Anonymous User"}
                          </span>
                          <span
                            className={`text-xs ml-2 px-1.5 py-0.5 rounded-full ${
                              item.userRole === "patient"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {item.userRole}
                          </span>
                        </div>
                        <p className="text-sm text-drift-gray mt-2 line-clamp-2">{item.message}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex space-x-2">
                            <span
                              className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(item.status)}`}
                            >
                              {item.status}
                            </span>
                            <span
                              className={`inline-block px-2 py-0.5 text-xs rounded-full ${getTypeColor(item.type)}`}
                            >
                              {item.type}
                            </span>
                          </div>
                          <div>{renderStars(item.rating)}</div>
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-drift-gray ml-2 md:hidden" />
                    </div>
                  </div>
                ))}
                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center p-4 border-t border-earth-beige">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-4 py-2 bg-soft-amber text-white rounded-md hover:bg-soft-amber/90 disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <span className="flex items-center">
                          <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                          Loading...
                        </span>
                      ) : (
                        "Load More"
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-drift-gray">No feedback found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Detail view */}
          {selectedTicket && (
            <div
              className={`border-t md:border-t-0 md:border-l border-earth-beige md:w-1/2 ${selectedTicket ? "block" : "hidden md:block"}`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-graphite">
                    {selectedTicket.type.charAt(0).toUpperCase() + selectedTicket.type.slice(1)} Feedback
                  </h2>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="p-1 rounded-full hover:bg-pale-stone md:hidden"
                  >
                    <X className="h-5 w-5 text-drift-gray" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                      <img
                        src={getUserProfileImage(selectedTicket) || "/placeholder.svg"}
                        alt={
                          (selectedTicket.userId && userProfiles[selectedTicket.userId]?.displayName) ||
                          selectedTicket.userName ||
                          "User"
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-graphite">
                        {(selectedTicket.userId && userProfiles[selectedTicket.userId]?.displayName) ||
                          selectedTicket.userName ||
                          "Anonymous User"}
                      </p>
                      <p className="text-xs text-drift-gray">
                        {(selectedTicket.userId && userProfiles[selectedTicket.userId]?.email) ||
                          selectedTicket.userEmail ||
                          ""}
                      </p>
                      {((selectedTicket.userId && userProfiles[selectedTicket.userId]?.specialty) ||
                        selectedTicket.specialty) && (
                        <p className="text-xs text-soft-amber">
                          {(selectedTicket.userId && userProfiles[selectedTicket.userId]?.specialty) ||
                            selectedTicket.specialty}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-drift-gray mr-1" />
                    <span className="text-sm text-drift-gray">{selectedTicket.date}</span>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(selectedTicket.status)}`}
                  >
                    {selectedTicket.status}
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs rounded-full ${getTypeColor(selectedTicket.type)}`}
                  >
                    {selectedTicket.type}
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                      selectedTicket.userRole === "patient"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {selectedTicket.userRole}
                  </span>
                </div>

                {selectedTicket.rating !== null && selectedTicket.rating !== undefined && (
                  <div className="mt-3">
                    <p className="text-sm text-drift-gray mb-1">Rating:</p>
                    {renderStars(selectedTicket.rating)}
                  </div>
                )}

                <div className="mt-4 p-4 bg-pale-stone rounded-lg">
                  <p className="text-sm text-graphite whitespace-pre-line">{selectedTicket.message}</p>
                </div>

                {selectedTicket.status === "responded" && selectedTicket.response && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full overflow-hidden mr-2 border border-green-200 flex-shrink-0">
                          <ProfileImage
                            src={adminProfile.photoURL}
                            alt={adminProfile.displayName || "Admin"}
                            className="h-full w-full"
                            role="admin"
                          />
                        </div>
                        <p className="text-sm font-medium text-green-800">{adminProfile.displayName}'s Response:</p>
                      </div>
                    </div>
                    <p className="text-sm text-graphite whitespace-pre-line">{selectedTicket.response}</p>
                  </div>
                )}

                {selectedTicket.status !== "responded" && (
                  <div className="mt-6">
                    <label htmlFor="response" className="block text-sm font-medium text-graphite mb-2">
                      Your Response
                    </label>
                    <textarea
                      id="response"
                      rows="4"
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Type your response here..."
                      className="w-full p-3 border border-earth-beige rounded-md focus:outline-none focus:ring-2 focus:ring-soft-amber"
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleSendResponse}
                        className="inline-flex items-center px-4 py-2 bg-soft-amber text-white rounded-md hover:bg-soft-amber/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-soft-amber"
                        disabled={!responseText.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Response
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Notification */}
      <SuccessNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />

      <style jsx global>{`
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
