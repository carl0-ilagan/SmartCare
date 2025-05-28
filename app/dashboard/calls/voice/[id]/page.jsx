"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Mic, MicOff, Phone, User, MessageSquare, Volume2, VolumeX, X, PhoneOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCall } from "@/contexts/call-context"
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  setDoc,
  deleteDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { addCallStatusMessage } from "@/lib/message-utils"
import CallNotification from "@/components/call-notification"
import {
  initializePeerConnection,
  createOffer,
  handleOffer,
  handleAnswer,
  collectIceCandidates,
  endCall,
  getCallStats,
} from "@/lib/webrtc"

export default function VoiceCallPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { startRingback, stopRingback } = useCall()
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callTime, setCallTime] = useState(0)
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [doctorInfo, setDoctorInfo] = useState(null)
  const [callStatus, setCallStatus] = useState("connecting") // connecting, connected, ended
  const [callId, setCallId] = useState(null)
  const [isCallAccepted, setIsCallAccepted] = useState(false)
  const [isIncomingCall, setIsIncomingCall] = useState(false)
  const [callQuality, setCallQuality] = useState(null)
  const [error, setError] = useState(null)
  const [permissionsGranted, setPermissionsGranted] = useState(false)

  // References for WebRTC
  const audioRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const localStreamRef = useRef(null)
  const callDocRef = useRef(null)
  const callTimerRef = useRef(null)
  const statsIntervalRef = useRef(null)
  const remoteAudioRef = useRef(null)

  // Fetch doctor information
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      if (!params.id) return

      try {
        const doctorDoc = await getDoc(doc(db, "users", params.id))

        if (doctorDoc.exists()) {
          setDoctorInfo({
            id: doctorDoc.id,
            ...doctorDoc.data(),
          })
        } else {
          console.error("Doctor not found")
          // Fallback to show something
          setDoctorInfo({
            id: params.id,
            displayName: "Doctor",
            specialty: "Healthcare Provider",
            avatar: null,
          })
        }
      } catch (error) {
        console.error("Error fetching doctor info:", error)
      }
    }

    fetchDoctorInfo()
  }, [params.id])

  // Initialize WebRTC
  useEffect(() => {
    if (!user || !params.id || !doctorInfo) return

    const setupWebRTC = async () => {
      try {
        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        localStreamRef.current = stream
        setPermissionsGranted(true)

        // Set up audio output
        if (audioRef.current) {
          audioRef.current.srcObject = stream
        }

        // Initialize peer connection
        const peerConnection = initializePeerConnection()
        peerConnectionRef.current = peerConnection

        // Add local tracks to peer connection
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream)
        })

        // Handle remote stream
        peerConnection.ontrack = (event) => {
          if (remoteAudioRef.current && event.streams[0]) {
            remoteAudioRef.current.srcObject = event.streams[0]
          }
        }

        // Check if we're the caller or callee
        const callDoc = await getDoc(doc(db, "calls", params.id))
        if (callDoc.exists()) {
          const callData = callDoc.data()
          setCallId(params.id)
          callDocRef.current = doc(db, "calls", params.id)
          setIsIncomingCall(callData.callerId !== user.uid)

          if (callData.callerId === user.uid) {
            // We're the caller
            const offer = await createOffer(peerConnection)
            await updateDoc(callDocRef.current, { offer })
          } else {
            // We're the callee
            if (callData.offer) {
              const answer = await handleOffer(peerConnection, callData.offer)
              await updateDoc(callDocRef.current, { answer })
            }
          }

          // Set up ICE candidate collection
          collectIceCandidates(params.id, peerConnection, user.uid, callData.callerId === user.uid ? callData.receiverId : callData.callerId)

          // Listen for call status changes
          onSnapshot(callDocRef.current, (doc) => {
            const data = doc.data()
            if (!data) return

            if (data.status === "accepted") {
              setCallStatus("connected")
              setIsCallAccepted(true)
              startCallTimer()
            } else if (data.status === "ended") {
              handleCallEnded()
            }

            // Handle answer if we're the caller
            if (data.answer && !peerConnection.currentRemoteDescription) {
              handleAnswer(peerConnection, data.answer)
            }
          })
        }

        // Start ringback tone for outgoing call
        startRingback()
      } catch (error) {
        console.error("Error setting up WebRTC:", error)
        alert("Could not access microphone. Please check permissions and try again.")
      }
    }

    setupWebRTC()

    return () => {
      // Cleanup
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current)
      }
      stopRingback()
    }
  }, [user, params.id, doctorInfo, startRingback, stopRingback, permissionsGranted])

  // Start call timer
  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallTime((prevTime) => prevTime + 1)
    }, 1000)

    // Start monitoring call quality
    statsIntervalRef.current = setInterval(async () => {
      if (peerConnectionRef.current) {
        const stats = await getCallStats(peerConnectionRef.current)
        setCallQuality(stats)
      }
    }, 2000)
  }

  // Format call time
  const formatCallTime = () => {
    const minutes = Math.floor(callTime / 60)
    const seconds = callTime % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!message.trim() || !callId) return

    // Add message to local state
    const newMessage = {
      sender: user?.uid,
      content: message,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Add message to Firestore
    if (callDocRef.current) {
      updateDoc(callDocRef.current, {
        messages: [...messages, newMessage],
      }).catch(console.error)
    }
  }

  // Handle ending the call
  const handleEndCall = async () => {
    if (callId) {
      await endCall(callId)
      handleCallEnded()
    }
  }

  // Handle call ended
  const handleCallEnded = () => {
    // Stop media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }

    // Clear timers
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
    }
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current)
    }

    setCallStatus("ended")

    // Redirect after a short delay
    setTimeout(() => {
      router.push("/dashboard/messages")
    }, 2000)
  }

  // Toggle mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  // Toggle speaker
  const toggleSpeaker = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = !remoteAudioRef.current.muted
      setIsSpeakerOn(!isSpeakerOn)
    }
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
        <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => router.push('/dashboard/messages')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Messages
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-900">
      {/* Call Status Overlay */}
      {callStatus === 'connecting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg">Connecting...</p>
          </div>
        </div>
      )}

      {/* Call Info */}
      <div className="absolute top-4 left-4 text-white">
        <h2 className="text-xl font-semibold">{doctorInfo?.displayName || 'Connecting...'}</h2>
        <p className="text-sm opacity-75">
          {callStatus === 'connected' ? formatCallTime() : 'Connecting...'}
        </p>
      </div>

      {/* Call Quality Indicator */}
      <div className="absolute top-4 right-4">
        <div className={`px-2 py-1 rounded text-sm ${
          callQuality === 'good' ? 'bg-green-500' :
          callQuality === 'poor' ? 'bg-red-500' :
          'bg-yellow-500'
        } text-white`}>
          {callQuality === 'good' ? 'Good' :
           callQuality === 'poor' ? 'Poor' :
           'Fair'} Connection
        </div>
      </div>

      {/* Remote Audio */}
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* Call Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
        <div className="flex justify-center space-x-6">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${
              isMuted ? 'bg-red-500' : 'bg-gray-700'
            } text-white hover:bg-opacity-80 transition-colors`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <button
            onClick={toggleSpeaker}
            className={`p-4 rounded-full ${
              !isSpeakerOn ? 'bg-red-500' : 'bg-gray-700'
            } text-white hover:bg-opacity-80 transition-colors`}
          >
            {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>

          <button
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>

      {/* Call Notification */}
      <CallNotification />
    </div>
  )
}
