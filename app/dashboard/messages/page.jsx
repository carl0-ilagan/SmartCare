"use client"

import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Filter,
  Info,
  MessageSquare,
<<<<<<< HEAD
  Phone,
  Search,
  User,
  Video,
  X,
  Plus,
  Loader2,
  ArrowUp,
  BellOff,
=======
  Paperclip,
  Phone,
  Search,
  Send,
  User,
  Video,
  X,
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { useRouter } from "next/navigation"
<<<<<<< HEAD
import { useAuth } from "@/contexts/auth-context"
import {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  unsendMessage,
  deleteConversation,
  getUserDetailsForConversation,
  getUserOnlineStatus,
  updateOnlineStatus,
  deleteMessageForMe,
  deleteMessageForEveryone,
  markConversationAsUnread,
  toggleConversationMute,
  isConversationMuted,
  loadMoreMessages,
  setTypingStatus,
  getTypingStatus,
} from "@/lib/message-utils"
import { isFileSizeValid, compressImage } from "@/lib/file-utils"
import NewConversationModal from "@/components/new-conversation-modal"
import MessageOptionsMenu from "@/components/message-options-menu"
import ConversationOptionsMenu from "@/components/conversation-options-menu"
import MessageDisplay from "@/components/message-display"
import MessageInput from "@/components/message-input"
import DeleteConversationModal from "@/components/delete-conversation-modal"
import { createCall } from "@/lib/call-utils"
import CallNotification from "@/components/call-notification"
=======
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

export default function MessagesPage() {
  const router = useRouter()
  const isMobile = useMobile()
<<<<<<< HEAD
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false)
=======
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState(null)
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
  const [newMessage, setNewMessage] = useState("")
  const [showMobileConversation, setShowMobileConversation] = useState(false)
  const [showDoctorInfo, setShowDoctorInfo] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
<<<<<<< HEAD
  const [showNewConversationModal, setShowNewConversationModal] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [fileError, setFileError] = useState("")
  const [doctorDetails, setDoctorDetails] = useState(null)
  const [doctorOnlineStatus, setDoctorOnlineStatus] = useState({ isOnline: false, lastActive: null })
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [selectedConversationData, setSelectedConversationData] = useState(null)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const messagesContainerRef = useRef(null)
  const conversationsContainerRef = useRef(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [typingUsers, setTypingUsers] = useState({})
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef(null)
  const [previewFile, setPreviewFile] = useState(null)
  const [showScrollControls, setShowScrollControls] = useState(false)
=======
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
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

  // Filter conversations
  const filteredConversations = conversations
    .filter((conversation) => {
<<<<<<< HEAD
      // We need doctor details for each conversation
      const otherParticipantId = conversation.participants.find((id) => id !== user?.uid)
      const otherParticipant = conversation.participantDetails?.[otherParticipantId]

      // If we don't have details yet, include it anyway
      if (!otherParticipant) return true

      // Filter by search term
      const matchesSearch =
        otherParticipant.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        otherParticipant.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false

      // Filter by status (unread messages)
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "unread" && (conversation.unreadCounts?.[user?.uid] || 0) > 0) ||
        (filterStatus === "read" &&
          (!conversation.unreadCounts ||
            !conversation.unreadCounts[user?.uid] ||
            conversation.unreadCounts[user?.uid] === 0))
=======
      // Filter by search term
      const matchesSearch =
        conversation.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.specialty.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by status
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "unread" && conversation.unread) ||
        (filterStatus === "read" && !conversation.unread)
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Sort by timestamp (most recent first)
<<<<<<< HEAD
      const timeA = a.updatedAt?.toDate?.() || new Date(0)
      const timeB = b.updatedAt?.toDate?.() || new Date(0)
      return timeB - timeA
    })

  // Set online status when component mounts and cleanup on unmount
  useEffect(() => {
    if (user) {
      updateOnlineStatus(user.uid, true)
    }

    return () => {
      if (user) {
        updateOnlineStatus(user.uid, false)
      }
    }
  }, [user])

  // Load conversations
  useEffect(() => {
    if (!user) return

    const unsubscribe = getUserConversations(user.uid, (data) => {
      setConversations(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  // Load messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation || !user) {
      setMessages([])
      setHasMoreMessages(true)
      return
    }

    setMessagesLoading(true)

    // Get the other participant's details
    const otherParticipantId = selectedConversation.participants.find((id) => id !== user?.uid)

    if (otherParticipantId) {
      // Get doctor details
      getUserDetailsForConversation(otherParticipantId)
        .then((details) => {
          setDoctorDetails(details)

          // Subscribe to doctor's online status
          const unsubscribeStatus = getUserOnlineStatus(otherParticipantId, (status) => {
            setDoctorOnlineStatus(status)
          })

          // Subscribe to messages - pass the user ID to filter deleted messages
          const unsubscribeMessages = getConversationMessages(selectedConversation.id, user.uid, (data) => {
            setMessages(data)
            setMessagesLoading(false)
            setHasMoreMessages(data.length >= 30) // If we got the maximum number of messages, there might be more

            // Mark messages as read
            markMessagesAsRead(selectedConversation.id, user?.uid)
          })

          return () => {
            unsubscribeStatus()
            unsubscribeMessages()
          }
        })
        .catch((error) => {
          console.error("Error getting doctor details:", error)
          setMessagesLoading(false)
        })
    }
  }, [selectedConversation, user])

  useEffect(() => {
    if (!selectedConversation || !user) return

    const unsubscribe = getTypingStatus(selectedConversation.id, user.uid, (typingData) => {
      setTypingUsers(typingData)
    })

    return () => unsubscribe()
  }, [selectedConversation, user])

  // Auto-scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && !loadingMoreMessages) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, loadingMoreMessages])

  // Set first conversation as selected by default (only on desktop)
  useEffect(() => {
    if (!isMobile && filteredConversations.length > 0 && !selectedConversation && !loading) {
      handleSelectConversation(filteredConversations[0])
    }
  }, [filteredConversations, selectedConversation, isMobile, loading])
=======
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
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

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
<<<<<<< HEAD
  }, [isMobile, inputRef])

  // Show scroll controls when hovering over conversations list (desktop only)
  useEffect(() => {
    if (isMobile) return

    const handleMouseEnter = () => setShowScrollControls(true)
    const handleMouseLeave = () => setShowScrollControls(false)

    const container = conversationsContainerRef.current
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [isMobile, conversationsContainerRef])

  // Handle scroll to load more messages
  useEffect(() => {
    if (!messagesContainerRef.current || !hasMoreMessages) return

    const handleScroll = () => {
      const { scrollTop } = messagesContainerRef.current

      // If we're near the top of the container and have more messages to load
      if (scrollTop < 50 && hasMoreMessages && !loadingMoreMessages && messages.length > 0) {
        handleLoadMoreMessages()
      }
    }

    const container = messagesContainerRef.current
    container.addEventListener("scroll", handleScroll)

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [messagesContainerRef, hasMoreMessages, loadingMoreMessages, messages])

  // Handle loading more messages
  const handleLoadMoreMessages = async () => {
    if (!selectedConversation || !user || !messages.length || loadingMoreMessages) return

    setLoadingMoreMessages(true)

    try {
      // Get the oldest message timestamp
      const oldestMessage = [...messages].sort((a, b) => {
        const timeA = a.timestamp?.toDate?.() || new Date(0)
        const timeB = b.timestamp?.toDate?.() || new Date(0)
        return timeA - timeB
      })[0]

      if (!oldestMessage || !oldestMessage.timestamp) {
        setHasMoreMessages(false)
        setLoadingMoreMessages(false)
        return
      }

      // Save scroll position
      const container = messagesContainerRef.current
      const scrollHeight = container.scrollHeight

      // Load older messages
      const olderMessages = await loadMoreMessages(selectedConversation.id, user.uid, oldestMessage.timestamp, 20)

      if (olderMessages.length === 0) {
        setHasMoreMessages(false)
      } else {
        // Combine with existing messages, avoiding duplicates
        const existingIds = new Set(messages.map((m) => m.id))
        const uniqueOlderMessages = olderMessages.filter((m) => !existingIds.has(m.id))

        setMessages((prev) => [...uniqueOlderMessages, ...prev])

        // Restore scroll position after new messages are added
        setTimeout(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight
            container.scrollTop = newScrollHeight - scrollHeight
          }
        }, 100)
      }
    } catch (error) {
      console.error("Error loading more messages:", error)
    } finally {
      setLoadingMoreMessages(false)
    }
  }

  // Handle scrolling the conversations list
  const handleScrollConversations = (direction) => {
    if (!conversationsContainerRef.current) return

    const container = conversationsContainerRef.current
    const scrollAmount = 300 // Adjust as needed

    if (direction === "up") {
      container.scrollBy({ top: -scrollAmount, behavior: "smooth" })
    } else {
      container.scrollBy({ top: scrollAmount, behavior: "smooth" })
    }
  }

  const handleTyping = () => {
    if (!selectedConversation || !user) return

    // Only update if not already set as typing
    if (!isTyping) {
      setIsTyping(true)
      setTypingStatus(selectedConversation.id, user.uid, true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set timeout to clear typing status after 5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      setTypingStatus(selectedConversation.id, user.uid, false)
    }, 5000)
  }
=======
  }, [isMobile, inputRef.current])
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

  // Handle selecting a conversation on mobile
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)
<<<<<<< HEAD
    setSelectedConversationData({
      id: conversation.id,
      ...conversation,
    })
    setHasMoreMessages(true)

=======
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
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

<<<<<<< HEAD
  // Handle file selection
  const handleFileSelect = async (e) => {
    setFileError("")

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (1MB limit)
      if (!isFileSizeValid(file, 1)) {
        setFileError("File size exceeds the limit (1MB)")
        return
      }

      try {
        // If it's an image, compress it
        if (file.type && file.type.startsWith("image/")) {
          const compressedFile = await compressImage(file)
          setSelectedFile(compressedFile)
        } else {
          setSelectedFile(file)
        }
      } catch (error) {
        console.error("Error processing file:", error)
        setFileError("Error processing file. Please try again.")
      }
    }
  }

  // Handle file button click
  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Handle removing selected file
  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFileError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault()

    if ((!newMessage.trim() && !selectedFile) || !selectedConversation || !user) return
    if (fileError) return

    try {
      setSendingMessage(true)

      // Prepare reply data if replying to a message
      const replyData = replyingTo
        ? {
            id: replyingTo.id,
            content: replyingTo.content,
            sender: replyingTo.sender,
            senderName: replyingTo.sender === user.uid ? user.displayName : doctorDetails?.displayName,
          }
        : null

      if (selectedFile) {
        // Determine file type
        let fileType = "file"
        if (selectedFile.type && selectedFile.type.startsWith("image/")) {
          fileType = "image"
        } else if (selectedFile.type && selectedFile.type.startsWith("audio/")) {
          fileType = "audio"
        } else if (selectedFile.type && selectedFile.type.startsWith("video/")) {
          fileType = "video"
        } else if (selectedFile.type && selectedFile.type.startsWith("audio/")) {
          fileType = "audio"
        }

        // Generate a timestamp-based filename if none exists
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const fileName = selectedFile.name || `${fileType}-${timestamp}`

        // Send file message
        await sendMessage(
          selectedConversation.id,
          user.uid,
          newMessage.trim() || fileName,
          fileType,
          selectedFile,
          replyData,
          fileName,
        )

        // Clear file
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        // Send text message
        await sendMessage(selectedConversation.id, user.uid, newMessage.trim(), "text", null, replyData)
      }

      // Clear input and reply state
      setNewMessage("")
      setReplyingTo(null)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSendingMessage(false)
    }
  }

  // Handle unsending a message
  const handleUnsendMessage = async (message) => {
    if (!user || message.sender !== user.uid) return

    try {
      await unsendMessage(selectedConversation.id, message.id, user.uid)
    } catch (error) {
      console.error("Error unsending message:", error)
    }
  }

  // Handle deleting a message for me
  const handleDeleteMessage = async (message) => {
    if (!user || !selectedConversation) return

    try {
      await deleteMessageForMe(selectedConversation.id, message.id, user.uid)
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }

  // Handle deleting a message for everyone
  const handleDeleteMessageForEveryone = async (message) => {
    if (!user || message.sender !== user.uid || !selectedConversation) return

    try {
      await deleteMessageForEveryone(selectedConversation.id, message.id, user.uid)
    } catch (error) {
      console.error("Error deleting message for everyone:", error)
    }
  }

  // Handle deleting a conversation
  const handleDeleteConversation = async () => {
    if (!selectedConversation || !user) return

    try {
      await deleteConversation(selectedConversation.id, user.uid)

      // Go back to conversation list on mobile
      if (isMobile) {
        setShowMobileConversation(false)
      }

      // Clear selected conversation
      setSelectedConversation(null)
      setShowDeleteConfirmation(false)
    } catch (error) {
      console.error("Error deleting conversation:", error)
    }
  }

  // Handle confirming delete conversation
  const handleConfirmDelete = () => {
    setShowDeleteConfirmation(true)
  }

  // Handle canceling delete conversation
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false)
  }

  // Handle marking a conversation as unread
  const handleMarkAsUnread = async () => {
    if (!selectedConversation || !user) return

    try {
      await markConversationAsUnread(selectedConversation.id, user.uid)

      // Go back to conversation list on mobile
      if (isMobile) {
        setShowMobileConversation(false)
      }
    } catch (error) {
      console.error("Error marking conversation as unread:", error)
    }
  }

  // Handle muting a conversation
  const handleMuteConversation = async () => {
    if (!selectedConversation || !user) return

    try {
      await toggleConversationMute(selectedConversation.id, user.uid, true)
    } catch (error) {
      console.error("Error muting conversation:", error)
    }
  }

  // Handle unmuting a conversation
  const handleUnmuteConversation = async () => {
    if (!selectedConversation || !user) return

    try {
      await toggleConversationMute(selectedConversation.id, user.uid, false)
    } catch (error) {
      console.error("Error unmuting conversation:", error)
    }
  }

  // Handle copying message text
  const handleCopyMessage = (message) => {
    if (message.content) {
      navigator.clipboard.writeText(message.content)
    }
  }

  // Handle replying to a message
  const handleReplyToMessage = (message) => {
    setReplyingTo({
      id: message.id,
      content: message.content,
      sender: message.sender,
      isSender: message.sender === user?.uid,
    })
    inputRef.current?.focus()
  }

  // Handle canceling a reply
  const handleCancelReply = () => {
    setReplyingTo(null)
=======
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
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
  }

  // Format timestamp
  const formatTime = (timestamp) => {
<<<<<<< HEAD
    if (!timestamp) return ""

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
=======
    const date = new Date(timestamp)
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
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

<<<<<<< HEAD
  // Format last active time
  const formatLastActive = (timestamp) => {
    if (!timestamp) return "Offline"

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffMinutes < 1) {
      return "Just now"
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`
    } else {
      const diffHours = Math.floor(diffMinutes / 60)
      if (diffHours < 24) {
        return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
      } else {
        const diffDays = Math.floor(diffHours / 24)
        if (diffDays < 7) {
          return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
        } else {
          return date.toLocaleDateString()
        }
      }
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size"

    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
    else return (bytes / 1073741824).toFixed(1) + " GB"
  }

  // Handle video call
  const handleVideoCall = () => {
    if (selectedConversation && doctorDetails) {
      // Create a new call with conversation ID
      createCall(user.uid, doctorDetails.id, "video", selectedConversation.id)
        .then((callId) => {
          if (callId) {
            router.push(`/dashboard/calls/video/${doctorDetails.id}`)
          }
        })
        .catch((error) => {
          console.error("Error starting video call:", error)
        })
=======
  // Handle video call
  const handleVideoCall = () => {
    if (selectedConversation) {
      router.push(`/dashboard/calls/video/${selectedConversation.id}`)
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    }
  }

  // Handle voice call
  const handleVoiceCall = () => {
<<<<<<< HEAD
    if (selectedConversation && doctorDetails) {
      // Create a new call with conversation ID
      createCall(user.uid, doctorDetails.id, "voice", selectedConversation.id)
        .then((callId) => {
          if (callId) {
            router.push(`/dashboard/calls/voice/${doctorDetails.id}`)
          }
        })
        .catch((error) => {
          console.error("Error starting voice call:", error)
        })
    }
  }

  // Handle new conversation created
  const handleConversationCreated = (conversationId) => {
    // Find the new conversation in our list
    const newConvo = conversations.find((c) => c.id === conversationId)
    if (newConvo) {
      handleSelectConversation(newConvo)
    }
  }

  // Check if conversation is muted
  const checkIfMuted = (conversation) => {
    if (!conversation || !user) return false
    return isConversationMuted(conversation, user.uid)
  }

  // Render conversation list
  const renderConversationList = () => (
    <div className="flex h-full flex-col bg-white overflow-hidden relative">
      <div className="border-b border-pale-stone p-3 sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between mb-3">
          <Link href="/dashboard" className="flex items-center text-drift-gray hover:text-soft-amber">
            <ArrowLeft className="mr-1 h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={() => setShowNewConversationModal(true)}
            className="rounded-full bg-soft-amber p-2 text-white hover:bg-amber-600"
            title="New Conversation"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
=======
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
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
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

<<<<<<< HEAD
      <div ref={conversationsContainerRef} className="flex-1 overflow-y-auto relative h-full">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-soft-amber" />
          </div>
        ) : filteredConversations.length > 0 ? (
          <ul className="divide-y divide-pale-stone">
            {filteredConversations.map((conversation) => {
              // Get the other participant's ID
              const otherParticipantId = conversation.participants.find((id) => id !== user?.uid)

              // Get participant details (may be undefined if still loading)
              const otherParticipant = conversation.participantDetails?.[otherParticipantId] || {}

              // Check if there are unread messages
              const hasUnread = (conversation.unreadCounts?.[user?.uid] || 0) > 0

              // Check if conversation is muted
              const isMuted = checkIfMuted(conversation)

              return (
                <li key={conversation.id}>
                  <button
                    onClick={() => handleSelectConversation(conversation)}
                    className={`flex w-full items-start p-3 text-left transition-colors hover:bg-pale-stone/30 ${
                      selectedConversation?.id === conversation.id && !isMobile ? "bg-pale-stone/50" : ""
                    } ${hasUnread ? "font-medium" : ""}`}
                  >
                    <div className="relative mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-pale-stone">
                      {otherParticipant.photoURL ? (
                        <img
                          src={otherParticipant.photoURL || "/placeholder.svg"}
                          alt={otherParticipant.displayName || "Doctor"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-full w-full p-2 text-drift-gray" />
                      )}
                      {hasUnread && <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-soft-amber"></span>}
                      {otherParticipant.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                      )}
                      {isMuted && (
                        <span className="absolute bottom-0 left-0 h-3 w-3 rounded-full bg-gray-500 border-2 border-white flex items-center justify-center">
                          <BellOff className="h-2 w-2 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="truncate text-sm text-graphite">{otherParticipant.displayName || "Loading..."}</p>
                        <p className="text-xs text-drift-gray">
                          {formatTime(conversation.updatedAt || conversation.createdAt)}
                        </p>
                      </div>
                      <p className="text-xs text-drift-gray">{otherParticipant.specialty || ""}</p>
                      <p className="mt-1 truncate text-xs text-drift-gray">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </button>
                </li>
              )
            })}
=======
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
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
          </ul>
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <div className="text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-drift-gray" />
              <p className="mt-2 text-sm text-drift-gray">No conversations found</p>
<<<<<<< HEAD
              <button
                onClick={() => setShowNewConversationModal(true)}
                className="mt-4 rounded-md bg-soft-amber px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
              >
                Start a new conversation
              </button>
            </div>
          </div>
        )}

        {/* Scroll controls for desktop */}
        {!isMobile && showScrollControls && filteredConversations.length > 5 && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col space-y-2">
            <button
              onClick={() => handleScrollConversations("up")}
              className="rounded-full bg-white p-1 shadow-md hover:bg-pale-stone text-drift-gray"
              aria-label="Scroll up"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleScrollConversations("down")}
              className="rounded-full bg-white p-1 shadow-md hover:bg-pale-stone text-drift-gray"
              aria-label="Scroll down"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        )}
=======
            </div>
          </div>
        )}
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
      </div>
    </div>
  )

  // Render conversation view
  const renderConversationView = () => (
<<<<<<< HEAD
    <div className="flex h-full flex-col bg-white overflow-hidden">
      {selectedConversation && doctorDetails ? (
        <>
          {/* Conversation Header */}
          <div className="flex items-center justify-between border-b border-pale-stone p-3 sticky top-0 z-10 bg-white">
=======
    <div className="flex h-full flex-col bg-white">
      {selectedConversation ? (
        <>
          {/* Conversation Header */}
          <div className="flex items-center justify-between border-b border-pale-stone p-3">
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
            <div className="flex items-center">
              {isMobile && (
                <button
                  onClick={handleBackToList}
                  className="mr-2 rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
<<<<<<< HEAD
              <div className="relative mr-3 h-10 w-10 overflow-hidden rounded-full bg-pale-stone">
                {doctorDetails.photoURL ? (
                  <img
                    src={doctorDetails.photoURL || "/placeholder.svg"}
                    alt={doctorDetails.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-full w-full p-2 text-drift-gray" />
                )}
                {doctorOnlineStatus.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                )}
              </div>
              <div>
                <h2 className="font-medium text-graphite">{doctorDetails.displayName}</h2>
                <p className="text-xs text-drift-gray flex items-center">
                  {doctorOnlineStatus.isOnline ? (
                    <>
                      <span className="mr-1 h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                      Online
                    </>
                  ) : (
                    <>Last active: {formatLastActive(doctorOnlineStatus.lastActive)}</>
                  )}
                </p>
=======
              <div className="mr-3 h-10 w-10 overflow-hidden rounded-full bg-pale-stone">
                <User className="h-full w-full p-2 text-drift-gray" />
              </div>
              <div>
                <h2 className="font-medium text-graphite">{selectedConversation.doctor}</h2>
                <p className="text-xs text-drift-gray">{selectedConversation.specialty}</p>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
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
<<<<<<< HEAD
              <ConversationOptionsMenu
                onDelete={handleConfirmDelete}
                onMute={handleMuteConversation}
                onUnmute={handleUnmuteConversation}
                onMarkAsUnread={handleMarkAsUnread}
                isMuted={checkIfMuted(selectedConversation)}
              />
=======
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
            </div>
          </div>

          {/* Messages */}
<<<<<<< HEAD
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 h-full">
            {messagesLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-soft-amber" />
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-4">
                {/* Loading more messages indicator */}
                {loadingMoreMessages && (
                  <div className="flex justify-center py-2">
                    <Loader2 className="h-6 w-6 animate-spin text-soft-amber" />
                  </div>
                )}

                {/* Load more button (alternative to scroll) */}
                {hasMoreMessages && !loadingMoreMessages && (
                  <div className="flex justify-center py-2">
                    <button
                      onClick={handleLoadMoreMessages}
                      className="flex items-center rounded-md bg-pale-stone px-3 py-1 text-xs text-drift-gray hover:bg-soft-amber/20"
                    >
                      <ArrowUp className="mr-1 h-3 w-3" />
                      Load older messages
                    </button>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === user?.uid ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender !== user?.uid && (
                      <div className="mr-2 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-pale-stone">
                        {doctorDetails.photoURL ? (
                          <img
                            src={doctorDetails.photoURL || "/placeholder.svg"}
                            alt={doctorDetails.displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-full w-full p-1.5 text-drift-gray" />
                        )}
                      </div>
                    )}

                    <MessageDisplay
                      message={message}
                      isSender={message.sender === user?.uid}
                      formatTime={formatTime}
                      formatFileSize={formatFileSize}
                      senderName={message.sender === user?.uid ? user.displayName : doctorDetails.displayName}
                      currentUserName={user?.displayName}
                      patientDetails={user}
                      doctorDetails={doctorDetails}
                    />

                    {message.status !== "unsent" && (
                      <MessageOptionsMenu
                        message={message}
                        onUnsend={handleUnsendMessage}
                        onDelete={handleDeleteMessage}
                        onDeleteForEveryone={handleDeleteMessageForEveryone}
                        onCopy={handleCopyMessage}
                        onReply={handleReplyToMessage}
                        isSender={message.sender === user?.uid}
                      />
                    )}
                  </div>
                ))}
                {Object.keys(typingUsers).length > 0 && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-pale-stone">
                      {doctorDetails?.photoURL ? (
                        <img
                          src={doctorDetails.photoURL || "/placeholder.svg"}
                          alt={doctorDetails.displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-full w-full p-1.5 text-drift-gray" />
                      )}
                    </div>
                    <div className="bg-pale-stone text-graphite rounded-lg p-3 flex items-center">
                      <div className="flex space-x-1">
                        <span
                          className="w-2 h-2 bg-drift-gray rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-drift-gray rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-drift-gray rounded-full animate-bounce"
                          style={{ animationDelay: "600ms" }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center">
                <MessageSquare className="h-12 w-12 text-drift-gray" />
                <p className="mt-4 text-center text-drift-gray">No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>

          {/* Message Input */}
          <MessageInput
            value={newMessage}
            onChange={setNewMessage}
            onSend={handleSendMessage}
            onFileSelect={(fileData) => {
              setSelectedFile(fileData.file)
              if (fileData.fileData) {
                // If fileData is provided (from voice recorder or camera)
                setSelectedFile({
                  ...fileData.file,
                  fileData: fileData.fileData,
                })
              }
            }}
            selectedFile={selectedFile}
            onRemoveFile={handleRemoveFile}
            fileError={fileError}
            sendingMessage={sendingMessage}
            replyingTo={replyingTo}
            onCancelReply={handleCancelReply}
            onTyping={handleTyping}
            otherUserName={doctorDetails?.displayName}
          />
=======
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
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
        </>
      ) : (
        <div className="flex h-full items-center justify-center p-4">
          <div className="text-center">
<<<<<<< HEAD
            <MessageSquare className="h-12 w-12 text-drift-gray" />
=======
            <MessageSquare className="mx-auto h-12 w-12 text-drift-gray" />
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
            <h3 className="mt-2 text-lg font-medium text-graphite">No conversation selected</h3>
            <p className="mt-1 text-drift-gray">Select a conversation from the list to view messages</p>
          </div>
        </div>
      )}
    </div>
  )

  // Doctor Info Modal
  const renderDoctorInfoModal = () => {
<<<<<<< HEAD
    if (!showDoctorInfo || !doctorDetails) return null
=======
    if (!showDoctorInfo || !selectedConversation) return null
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

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
<<<<<<< HEAD
              {doctorDetails.photoURL ? (
                <img
                  src={doctorDetails.photoURL || "/placeholder.svg"}
                  alt={doctorDetails.displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-full w-full p-3 text-drift-gray" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-graphite">{doctorDetails.displayName}</h3>
              <p className="text-soft-amber">{doctorDetails.specialty}</p>
=======
              <User className="h-full w-full p-3 text-drift-gray" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-graphite">{selectedConversation.doctor}</h3>
              <p className="text-soft-amber">{selectedConversation.specialty}</p>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-drift-gray">About</h4>
<<<<<<< HEAD
              <p className="text-sm text-graphite">{doctorDetails.bio || "No bio available"}</p>
=======
              <p className="text-sm text-graphite">{selectedConversation.bio}</p>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className="text-sm font-medium text-drift-gray">Education</h4>
<<<<<<< HEAD
                <p className="text-sm text-graphite">{doctorDetails.education || "Not specified"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-drift-gray">Experience</h4>
                <p className="text-sm text-graphite">{doctorDetails.experience || "Not specified"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-drift-gray">Languages</h4>
                <p className="text-sm text-graphite">{doctorDetails.languages || "Not specified"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-drift-gray">Contact</h4>
                <p className="text-sm text-graphite">{doctorDetails.phone || "Not available"}</p>
=======
                <p className="text-sm text-graphite">{selectedConversation.education}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-drift-gray">Experience</h4>
                <p className="text-sm text-graphite">{selectedConversation.experience}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-drift-gray">Languages</h4>
                <p className="text-sm text-graphite">{selectedConversation.languages}</p>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
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
<<<<<<< HEAD
        <div className="grid h-full w-full grid-cols-[350px_1fr] overflow-hidden">
          <div className="h-full overflow-hidden">{renderConversationList()}</div>
          <div className="h-full overflow-hidden">{renderConversationView()}</div>
=======
        <div className="grid h-full w-full grid-cols-[350px_1fr]">
          {renderConversationList()}
          {renderConversationView()}
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
        </div>
      )}

      {/* Doctor Info Modal */}
      {renderDoctorInfoModal()}
<<<<<<< HEAD

      {/* Delete Confirmation Modal */}
      <DeleteConversationModal
        isOpen={showDeleteConfirmation}
        onClose={handleCancelDelete}
        onDelete={handleDeleteConversation}
      />

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={showNewConversationModal}
        onClose={() => setShowNewConversationModal(false)}
        onConversationCreated={handleConversationCreated}
      />
      {/* Call Notification */}
      <CallNotification />
=======
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    </div>
  )
}
