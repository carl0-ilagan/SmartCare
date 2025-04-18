"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Mic, MicOff, Phone, User, MessageSquare, Volume2, VolumeX, X } from "lucide-react"

export default function VoiceCallPage() {
  const router = useRouter()
  const params = useParams()
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callTime, setCallTime] = useState(0)
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [doctorInfo, setDoctorInfo] = useState(null)

  // Mock doctor data based on ID
  useEffect(() => {
    // In a real app, this would fetch the doctor info from an API
    const mockDoctors = {
      1: {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        avatar: null,
      },
      2: {
        id: 2,
        name: "Dr. Michael Chen",
        specialty: "Dermatologist",
        avatar: null,
      },
      3: {
        id: 3,
        name: "Dr. Emily Rodriguez",
        specialty: "Neurologist",
        avatar: null,
      },
    }

    if (params.id && mockDoctors[params.id]) {
      setDoctorInfo(mockDoctors[params.id])
    }
  }, [params.id])

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime((prevTime) => prevTime + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format call time
  const formatCallTime = () => {
    const minutes = Math.floor(callTime / 60)
    const seconds = callTime % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!message.trim()) return

    setMessages([...messages, { sender: "patient", content: message }])
    setMessage("")

    // Mock doctor response after a delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "doctor",
          content: "I understand. Let me explain that in more detail.",
        },
      ])
    }, 2000)
  }

  // Handle ending the call
  const handleEndCall = () => {
    router.push("/dashboard/messages")
  }

  return (
    <div className="h-screen w-full bg-graphite text-white">
      {/* Main call area */}
      <div className="relative h-full w-full">
        {/* Doctor's profile */}
        <div className="absolute inset-0 flex items-center justify-center">
          {doctorInfo && (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-6 h-32 w-32 overflow-hidden rounded-full bg-pale-stone">
                <User className="h-full w-full p-6 text-drift-gray" />
              </div>
              <h2 className="text-2xl font-bold">{doctorInfo.name}</h2>
              <p className="text-soft-amber">{doctorInfo.specialty}</p>
              <div className="mt-4 text-lg">
                <p>Voice Call</p>
                <p className="mt-2">{formatCallTime()}</p>
              </div>

              {/* Audio visualization (simulated) */}
              <div className="mt-8 flex h-12 w-64 items-center justify-center space-x-1">
                {Array.from({ length: 20 }).map((_, i) => {
                  const height = Math.sin(i / 3 + callTime / 2) * 20 + 30
                  return <div key={i} className="w-1 bg-soft-amber" style={{ height: `${height}%` }}></div>
                })}
              </div>
            </div>
          )}
        </div>

        {/* Call controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="mx-auto flex max-w-md flex-col items-center">
            {/* Call duration */}
            <div className="mb-2 rounded-full bg-black/50 px-4 py-1">
              <span>{formatCallTime()}</span>
            </div>

            {/* Call controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`rounded-full p-3 ${isMuted ? "bg-red-500" : "bg-white/20"}`}
              >
                {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </button>

              <button onClick={handleEndCall} className="rounded-full bg-red-500 p-4">
                <Phone className="h-6 w-6 rotate-135" />
              </button>

              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`rounded-full p-3 ${!isSpeakerOn ? "bg-red-500" : "bg-white/20"}`}
              >
                {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className={`rounded-full p-3 ${showChat ? "bg-soft-amber" : "bg-white/20"}`}
              >
                <MessageSquare className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat sidebar */}
        {showChat && (
          <div className="absolute bottom-0 right-0 top-0 w-80 bg-white text-graphite">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-pale-stone p-3">
                <h3 className="font-medium">Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="rounded-full p-1 text-drift-gray hover:bg-pale-stone"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {messages.length > 0 ? (
                  <div className="space-y-3">
                    {messages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-2 ${
                            msg.sender === "patient" ? "bg-soft-amber text-white" : "bg-pale-stone text-graphite"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center text-sm text-drift-gray">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              <div className="border-t border-pale-stone p-3">
                <form onSubmit={handleSendMessage} className="flex">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-l-md border border-earth-beige bg-white py-2 px-3 text-graphite placeholder:text-drift-gray/60 focus:border-soft-amber focus:outline-none focus:ring-1 focus:ring-soft-amber"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="rounded-r-md bg-soft-amber px-3 py-2 text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
