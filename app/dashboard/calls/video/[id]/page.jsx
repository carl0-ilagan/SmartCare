"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Mic, MicOff, Phone, Video, VideoOff, PhoneOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCall } from "@/contexts/call-context"
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  initializePeerConnection,
  createOffer,
  handleOffer,
  handleAnswer,
  collectIceCandidates,
  endCall,
  getCallStats,
} from "@/lib/webrtc"

export default function VideoCallPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { startRingback, stopRingback } = useCall()
  const [callStatus, setCallStatus] = useState("connecting")
  const [doctor, setDoctor] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [callQuality, setCallQuality] = useState("good")
  const [error, setError] = useState(null)
  const [permissionsGranted, setPermissionsGranted] = useState(false)

  // References for WebRTC
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const localStreamRef = useRef(null)
  const timerRef = useRef(null)

  // Request permissions and setup media
  useEffect(() => {
    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        setPermissionsGranted(true)
      } catch (err) {
        console.error("Error accessing media devices:", err)
        setError("Please allow access to camera and microphone to make video calls.")
      }
    }

    setupMedia()

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Setup call
  useEffect(() => {
    if (!user || !params.id || !permissionsGranted) return

    const setupCall = async () => {
      try {
        // Get call details
        const callDoc = await getDoc(doc(db, "calls", params.id))
        if (!callDoc.exists()) {
          throw new Error("Call not found")
        }

        const callData = callDoc.data()
        if (callData.status === "ended") {
          router.push("/dashboard/messages")
          return
        }

        // Get doctor details
        const doctorDoc = await getDoc(doc(db, "users", callData.doctorId))
        if (!doctorDoc.exists()) {
          throw new Error("Doctor not found")
        }
        setDoctor(doctorDoc.data())

        // Initialize peer connection
        const pc = await initializePeerConnection()
        peerConnectionRef.current = pc

        // Add local stream
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current)
        })

        // Handle remote stream
        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]
          }
        }

        // Set up ICE candidate collection
        collectIceCandidates(pc, params.id)

        // Start ringback tone for outgoing call
        startRingback()

        if (callData.initiatorId === user.uid) {
          // We are the caller
          const offer = await createOffer(pc)
          await handleOffer(params.id, offer)
        } else {
          // We are the callee
          const offer = callData.offer
          await handleOffer(params.id, offer)
          const answer = await handleAnswer(pc, offer)
          await handleAnswer(params.id, answer)
        }

        // Listen for call status changes
        const unsubscribe = onSnapshot(doc(db, "calls", params.id), (doc) => {
          const data = doc.data()
          if (data.status === "connected") {
            setCallStatus("connected")
            stopRingback()
            startTimer()
          } else if (data.status === "ended") {
            cleanup()
            router.push("/dashboard/messages")
          }
        })

        return () => {
          unsubscribe()
          cleanup()
        }
      } catch (err) {
        console.error("Error setting up call:", err)
        setError(err.message)
      }
    }

    setupCall()
  }, [params.id, user.uid, router, startRingback, stopRingback, permissionsGranted])

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)
  }

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }
    stopRingback()
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!isMuted)
      }
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOff(!isVideoOff)
      }
    }
  }

  const endCallHandler = async () => {
    try {
      await endCall(params.id)
      cleanup()
      router.push("/dashboard/messages")
    } catch (err) {
      console.error("Error ending call:", err)
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
        <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => router.push("/dashboard/messages")}
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
      {/* Remote Video */}
      <div className="absolute inset-0">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Local Video (Picture-in-Picture) */}
      <div className="absolute bottom-24 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </div>

      {/* Call Status Overlay */}
      {callStatus === "connecting" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg">Connecting...</p>
          </div>
        </div>
      )}

      {/* Call Info */}
      <div className="absolute top-4 left-4 text-white">
        <h2 className="text-xl font-semibold">{doctor?.name || "Connecting..."}</h2>
        <p className="text-sm opacity-75">
          {callStatus === "connected" ? formatDuration(callDuration) : "Connecting..."}
        </p>
      </div>

      {/* Call Quality Indicator */}
      <div className="absolute top-4 right-4">
        <div className={`px-2 py-1 rounded text-sm ${
          callQuality === "good" ? "bg-green-500" :
          callQuality === "poor" ? "bg-red-500" :
          "bg-yellow-500"
        } text-white`}>
          {callQuality === "good" ? "Good" :
           callQuality === "poor" ? "Poor" :
           "Fair"} Connection
        </div>
      </div>

      {/* Call Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
        <div className="flex justify-center space-x-6">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${
              isMuted ? "bg-red-500" : "bg-gray-700"
            } text-white hover:bg-opacity-80 transition-colors`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${
              isVideoOff ? "bg-red-500" : "bg-gray-700"
            } text-white hover:bg-opacity-80 transition-colors`}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>

          <button
            onClick={endCallHandler}
            className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}
