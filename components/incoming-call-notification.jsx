"use client"

import { useState, useEffect, useRef } from "react"
import { Phone, Video, X, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { listenForIncomingCalls, acceptCall, declineCall } from "@/lib/call-service"
import { useRouter } from "next/navigation"

export default function IncomingCallNotification() {
  const { user } = useAuth()
  const [incomingCall, setIncomingCall] = useState(null)
  const router = useRouter()
  const ringtoneRef = useRef(null)

  useEffect(() => {
    if (!user) return

    // Listen for incoming calls
    const unsubscribe = listenForIncomingCalls(user.uid, (call) => {
      setIncomingCall(call)

      // Play ringtone if there's an incoming call
      if (call && ringtoneRef.current) {
        ringtoneRef.current.play().catch((error) => {
          console.error("Error playing ringtone:", error)
        })
      } else if (ringtoneRef.current) {
        ringtoneRef.current.pause()
        ringtoneRef.current.currentTime = 0
      }
    })

    return () => {
      unsubscribe()

      // Stop ringtone on unmount
      if (ringtoneRef.current) {
        ringtoneRef.current.pause()
        ringtoneRef.current.currentTime = 0
      }
    }
  }, [user])

  const handleAccept = async () => {
    if (!incomingCall) return

    try {
      // Stop ringtone
      if (ringtoneRef.current) {
        ringtoneRef.current.pause()
        ringtoneRef.current.currentTime = 0
      }

      // Accept the call
      await acceptCall(incomingCall.id)

      // Redirect to the appropriate call page
      const callType = incomingCall.callType
      const callerId = incomingCall.callerId

      if (callType === "video") {
        router.push(`/dashboard/calls/video/${callerId}?callId=${incomingCall.id}`)
      } else {
        router.push(`/dashboard/calls/voice/${callerId}?callId=${incomingCall.id}`)
      }
    } catch (error) {
      console.error("Error accepting call:", error)
    }
  }

  const handleDecline = async () => {
    if (!incomingCall) return

    try {
      // Stop ringtone
      if (ringtoneRef.current) {
        ringtoneRef.current.pause()
        ringtoneRef.current.currentTime = 0
      }

      // Decline the call
      await declineCall(incomingCall.id)
      setIncomingCall(null)
    } catch (error) {
      console.error("Error declining call:", error)
    }
  }

  if (!incomingCall) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <div className="mb-4 h-20 w-20 overflow-hidden rounded-full bg-pale-stone">
            {incomingCall.callerPhoto ? (
              <img
                src={incomingCall.callerPhoto || "/placeholder.svg"}
                alt={incomingCall.callerName}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-full w-full p-4 text-drift-gray" />
            )}
          </div>

          <h2 className="text-xl font-bold text-graphite">{incomingCall.callerName}</h2>

          <div className="mt-2 flex items-center text-soft-amber">
            {incomingCall.callType === "video" ? (
              <>
                <Video className="mr-2 h-5 w-5" />
                <span>Incoming Video Call</span>
              </>
            ) : (
              <>
                <Phone className="mr-2 h-5 w-5" />
                <span>Incoming Voice Call</span>
              </>
            )}
          </div>

          <div className="mt-6 flex w-full justify-center space-x-4">
            <button
              onClick={handleDecline}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={handleAccept}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600"
            >
              {incomingCall.callType === "video" ? <Video className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden audio element for ringtone */}
      <audio ref={ringtoneRef} src="/sounds/ringtone.mp3" loop className="hidden" />
    </div>
  )
}
