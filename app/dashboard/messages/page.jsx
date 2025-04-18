"use client"

import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Filter,
  Info,
  MessageSquare,
  Paperclip,
  Phone,
  Search,
  Send,
  User,
  Video,
  X,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function MessagesPage() {
  const router = useRouter()
  const isMobile = useMobile()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [showMobileConversation, setShowMobileConversation] = useState(false)
  const [showDoctorInfo, setShowDoctorInfo] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      lastMessage: "Please let me know if you have any questions about your medication.",
      timestamp: "2023-06-10T14:30:00",
      unread: true,
      avatar: null,
      bio: "Dr. Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She specializes in preventive cardiology and heart failure management.",
      education: "Harvard Medical School",
      experience: "15+ years",
      languages: "English, Spanish",
      messages: [
        {
          id: 1,
          sender: "doctor",
          content:
            "Hello Mr. Doe, I'm following up on your recent appointment. How are you feeling with the new medication?",
          timestamp: "2023-06-10T10:15:00",
        },
        {
          id: 2,
          sender: "patient",
          content:
            "Hi Dr. Johnson, I'm feeling better but still having some mild side effects like dizziness in the morning.",
          timestamp: "2023-06-10T10:30:00",
        },
        {
          id: 3,
          sender: "doctor",
          content:
            "That's not uncommon with this medication. Try taking it with food in the evening instead of the morning. Let's monitor for a week and see if that helps.",
          timestamp: "2023-06-10T10:45:00",
        },
        {
          id: 4,
          sender: "doctor",
          content: "Please let me know if you have any questions about your medication.",
          timestamp: "2023-06-10T14:30:00",
        },
      ],
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      lastMessage: "Your test results look good. Continue with the prescribed treatment.",
      timestamp: "2023-06-08T09:45:00",
      unread: false,
      avatar: null,
      bio: "Dr. Chen is a dermatologist specializing in skin cancer detection and treatment. He has published numerous research papers on innovative dermatological treatments.",
      education: "Johns Hopkins University",
      experience: "12+ years",
      languages: "English, Chinese",
      messages: [
        {
          id: 1,
          sender: "doctor",
          content: "Good morning Mr. Doe, I've reviewed your skin test results.",
          timestamp: "2023-06-08T09:15:00",
        },
        {
          id: 2,
          sender: "patient",
          content: "Good morning Dr. Chen. What did the results show?",
          timestamp: "2023-06-08T09:20:00",
        },
        {
          id: 3,
          sender: "doctor",
          content:
            "Your test results look good. Continue with the prescribed treatment. The rash should clear up completely in about a week.",
          timestamp: "2023-06-08T09:45:00",
        },
      ],
    },
    {
      id: 3,
      doctor: "Dr. Emily Rodriguez",
      specialty: "Neurologist",
      lastMessage: "I've scheduled you for an MRI next Tuesday at 10 AM.",
      timestamp: "2023-06-05T16:20:00",
      unread: false,
      avatar: null,
      bio: "Dr. Rodriguez specializes in treating neurological disorders including migraines, epilepsy, and multiple sclerosis. She is passionate about improving quality of life for patients with chronic neurological conditions.",
      education: "Stanford University",
      experience: "10+ years",
      languages: "English, Spanish",
      messages: [
        {
          id: 1,
          sender: "patient",
          content: "Dr. Rodriguez, I've been experiencing more frequent headaches as we discussed in my appointment.",
          timestamp: "2023-06-05T15:30:00",
        },
        {
          id: 2,
          sender: "doctor",
          content:
            "I'm sorry to hear that. Based on your symptoms, I think we should do an MRI to rule out any concerns.",
          timestamp: "2023-06-05T15:45:00",
        },
        {
          id: 3,
          sender: "patient",
          content: "That sounds like a good idea. When can we schedule it?",
          timestamp: "2023-06-05T16:00:00",
        },
        {
          id: 4,
          sender: "doctor",
          content:
            "I've scheduled you for an MRI next Tuesday at 10 AM. Please arrive 30 minutes early to complete the paperwork.",
          timestamp: "2023-06-05T16:20:00",
        },
      ],
    },
  ]

  // Filter conversations
  const filteredConversations = conversations
    .filter((conversation) => {
      // Filter by search term
      const matchesSearch =
        conversation.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.specialty.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by status
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "unread" && conversation.unread) ||
        (filterStatus === "read" && !conversation.unread)

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Sort by timestamp (most recent first)
      return new Date(b.timestamp) - new Date(a.timestamp)
    })

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedConversation])

  // Set first conversation as selected by default (only on desktop)
  useEffect(() => {
    if (!isMobile && filteredConversations.length > 0 && !selectedConversation) {
      setSelectedConversation(filteredConversations[0])
    }
  }, [filteredConversations, selectedConversation, isMobile])

  // Handle keyboard visibility on mobile
  useEffect(() => {
    if (!isMobile) return

    const handleFocus = () => setIsKeyboardVisible(true)
    const handleBlur = () => setIsKeyboardVisible(false)

    if (inputRef.current) {
      inputRef.current.addEventListener("focus", handleFocus)
      inputRef.current.addEventListener("blur", handleBlur)
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("focus", handleFocus)
        inputRef.current.removeEventListener("blur", handleBlur)
      }
    }
  }, [isMobile, inputRef.current])

  // Handle selecting a conversation on mobile
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)
    if (isMobile) {
      setShowMobileConversation(true)
    }
  }

  // Handle back button on mobile
  const handleBackToList = () => {
    if (isMobile) {
      setShowMobileConversation(false)
    }
  }

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedConversation) return

    // In a real app, this would send the message to the backend
    // For now, we'll just update the local state
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation.id) {
        const newMsg = {
          id: conv.messages.length + 1,
          sender: "patient",
          content: newMessage,
          timestamp: new Date().toISOString(),
        }

        return {
          ...conv,
          lastMessage: newMessage,
          timestamp: new Date().toISOString(),
          messages: [...conv.messages, newMsg],
        }
      }
      return conv
    })

    // Update the selected conversation
    const updatedConversation = updatedConversations.find((c) => c.id === selectedConversation.id)
    setSelectedConversation(updatedConversation)

    // Clear the input
    setNewMessage("")
  }

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "long" })
    } else {
      return date.toLocaleDateString()
    }
  }

  // Handle video call
  const handleVideoCall = () => {
    if (selectedConversation) {
      router.push(`/dashboard/calls/video/${selectedConversation.id}`)
    }
  }

  // Handle voice call
  const handleVoiceCall = () => {
    if (selectedConversation) {
      router.push(`/dashboard/calls/voice/${selectedConversation.id}`)
    }
  }

  // Render conversation list
  const renderConversationList = () => (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-pale-stone p-3">
        <Link href="/dashboard" className="mb-3 flex items-center text-drift-gray hover:text-soft-amber">
          <ArrowLeft className="mr-1 h-5 w-5" />
          <span>Back to Home</span>
        </Link>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-drift-gray" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-earth-beige bg-white py-2 pl-10 pr-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
          />
        </div>
        <div className="mt-2 flex justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center text-xs font-medium text-drift-gray hover:text-soft-amber"
          >
            <Filter className="mr-1 h-3 w-3" />
            Filters
            {showFilters ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
          </button>
          <button className="text-xs font-medium text-soft-amber hover:underline">Mark all as read</button>
        </div>

        {showFilters && (
          <div className="mt-2">
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-md border border-earth-beige bg-white py-1 pl-3 pr-10 text-xs text-graphite focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          <ul className="divide-y divide-pale-stone">
            {filteredConversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  onClick={() => handleSelectConversation(conversation)}
                  className={`flex w-full items-start p-3 text-left transition-colors hover:bg-pale-stone/30 ${
                    selectedConversation?.id === conversation.id && !isMobile ? "bg-pale-stone/50" : ""
                  } ${conversation.unread ? "font-medium" : ""}`}
                >
                  <div className="relative mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-pale-stone">
                    <User className="h-full w-full p-2 text-drift-gray" />
                    {conversation.unread && (
                      <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-soft-amber"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="truncate text-sm text-graphite">{conversation.doctor}</p>
                      <p className="text-xs text-drift-gray">{formatTime(conversation.timestamp)}</p>
                    </div>
                    <p className="text-xs text-drift-gray">{conversation.specialty}</p>
                    <p className="mt-1 truncate text-xs text-drift-gray">{conversation.lastMessage}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <div className="text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-drift-gray" />
              <p className="mt-2 text-sm text-drift-gray">No conversations found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Render conversation view
  const renderConversationView = () => (
    <div className="flex h-full flex-col bg-white">
      {selectedConversation ? (
        <>
          {/* Conversation Header */}
          <div className="flex items-center justify-between border-b border-pale-stone p-3">
            <div className="flex items-center">
              {isMobile && (
                <button
                  onClick={handleBackToList}
                  className="mr-2 rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="mr-3 h-10 w-10 overflow-hidden rounded-full bg-pale-stone">
                <User className="h-full w-full p-2 text-drift-gray" />
              </div>
              <div>
                <h2 className="font-medium text-graphite">{selectedConversation.doctor}</h2>
                <p className="text-xs text-drift-gray">{selectedConversation.specialty}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleVoiceCall}
                className="rounded-full bg-pale-stone p-2 text-drift-gray hover:bg-soft-amber hover:text-white"
                title="Voice Call"
              >
                <Phone className="h-5 w-5" />
              </button>
              <button
                onClick={handleVideoCall}
                className="rounded-full bg-pale-stone p-2 text-drift-gray hover:bg-soft-amber hover:text-white"
                title="Video Call"
              >
                <Video className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowDoctorInfo(true)}
                className="rounded-full bg-pale-stone p-2 text-drift-gray hover:bg-soft-amber hover:text-white"
                title="Doctor Information"
              >
                <Info className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 ${isMobile && isKeyboardVisible ? "pb-32" : ""}`}>
            <div className="space-y-4">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "doctor" && (
                    <div className="mr-2 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-pale-stone">
                      <User className="h-full w-full p-1.5 text-drift-gray" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      message.sender === "patient" ? "bg-soft-amber text-white" : "bg-pale-stone text-graphite"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`mt-1 text-right text-xs ${
                        message.sender === "patient" ? "text-white/70" : "text-drift-gray"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t border-pale-stone p-3">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <button
                type="button"
                className="rounded-full p-2 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-earth-beige bg-white py-2 px-4 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="rounded-full bg-soft-amber p-2 text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center p-4">
          <div className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-drift-gray" />
            <h3 className="mt-2 text-lg font-medium text-graphite">No conversation selected</h3>
            <p className="mt-1 text-drift-gray">Select a conversation from the list to view messages</p>
          </div>
        </div>
      )}
    </div>
  )

  // Doctor Info Modal
  const renderDoctorInfoModal = () => {
    if (!showDoctorInfo || !selectedConversation) return null

    return (
      <>
        <div className="fixed inset-0 z-50 bg-black/50 transition-opacity" onClick={() => setShowDoctorInfo(false)} />
        <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-graphite">Doctor Information</h2>
            <button
              onClick={() => setShowDoctorInfo(false)}
              className="rounded-full p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center">
            <div className="mr-4 h-16 w-16 overflow-hidden rounded-full bg-pale-stone">
              <User className="h-full w-full p-3 text-drift-gray" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-graphite">{selectedConversation.doctor}</h3>
              <p className="text-soft-amber">{selectedConversation.specialty}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-drift-gray">About</h4>
              <p className="text-sm text-graphite">{selectedConversation.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className="text-sm font-medium text-drift-gray">Education</h4>
                <p className="text-sm text-graphite">{selectedConversation.education}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-drift-gray">Experience</h4>
                <p className="text-sm text-graphite">{selectedConversation.experience}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-drift-gray">Languages</h4>
                <p className="text-sm text-graphite">{selectedConversation.languages}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowDoctorInfo(false)}
              className="rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
            >
              Close
            </button>
          </div>
        </div>
      </>
    )
  }

  // Main render
  return (
    <div className="h-screen w-full">
      {isMobile ? (
        // Mobile layout
        <>
          {showMobileConversation && selectedConversation
            ? // Show conversation on mobile
              renderConversationView()
            : // Show list on mobile
              renderConversationList()}
        </>
      ) : (
        // Desktop layout - full screen with split view
        <div className="grid h-full w-full grid-cols-[350px_1fr]">
          {renderConversationList()}
          {renderConversationView()}
        </div>
      )}

      {/* Doctor Info Modal */}
      {renderDoctorInfoModal()}
    </div>
  )
}
