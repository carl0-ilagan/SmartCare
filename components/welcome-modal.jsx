"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { getWelcomeContent } from "@/lib/welcome-utils"

export function WelcomeModal({ userType, onClose }) {
  const [content, setContent] = useState({
    title: "",
    description: "",
    imageUrl: "",
    showOnLogin: true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true)
        const welcomeData = await getWelcomeContent()
        if (welcomeData && welcomeData[userType]) {
          setContent(welcomeData[userType])
        }
      } catch (error) {
        console.error("Error loading welcome content:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [userType])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
            <div className="h-40 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!content.showOnLogin) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-graphite mb-4">{content.title}</h2>
        <p className="text-drift-gray mb-6">{content.description}</p>

        {content.imageUrl && (
          <div className="mb-6 rounded-md overflow-hidden">
            <img src={content.imageUrl || "/placeholder.svg"} alt="Welcome" className="w-full h-auto object-cover" />
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-soft-amber text-white rounded-md hover:bg-soft-amber/90 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
