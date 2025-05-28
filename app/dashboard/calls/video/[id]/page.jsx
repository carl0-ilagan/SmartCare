"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCall } from "@/contexts/call-context"
import {
  doc,
  getDoc,
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
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        localStreamRef.current = stream;
        setPermissionsGranted(true);

        // Initialize peer connection
        const peerConnection = initializePeerConnection(
          params.id,
          (candidate) => {
            // Handle ICE candidate
            console.log('New ICE candidate:', candidate);
          },
          (state) => {
            console.log('Connection state changed:', state);
            if (state === 'connected') {
              setCallStatus('connected');
            } else if (state === 'failed' || state === 'disconnected') {
              setCallStatus('failed');
              setError('Connection lost');
            }
          }
        );

        peerConnectionRef.current = peerConnection;

        // Add local stream to peer connection
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });

        // Handle remote stream
        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Collect ICE candidates
        collectIceCandidates(params.id, peerConnection);

        // Get call details
        const callDoc = await getDoc(doc(db, 'calls', params.id));
        if (!callDoc.exists()) {
          throw new Error('Call not found');
        }

        const callData = callDoc.data();
        setDoctor({
          id: callData.callerId === user.uid ? callData.receiverId : callData.callerId,
          name: callData.callerId === user.uid ? callData.receiverName : callData.callerName,
          photo: callData.callerId === user.uid ? callData.receiverPhoto : callData.callerPhoto,
        });

        // Handle offer/answer exchange
        if (callData.callerId === user.uid) {
          // We are the caller
          const offer = await createOffer(peerConnection, params.id);
          console.log('Created offer:', offer);
        } else {
          // We are the receiver
          if (callData.offer) {
            const answer = await handleOffer(peerConnection, params.id, callData.offer);
            console.log('Created answer:', answer);
          }
        }

        // Listen for answer if we are the caller
        if (callData.callerId === user.uid) {
          onSnapshot(doc(db, 'calls', params.id), (doc) => {
            const data = doc.data();
            if (data.answer) {
              handleAnswer(peerConnection, data.answer);
            }
          });
        }

        // Start call timer
        timerRef.current = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);

        // Monitor call quality
        const statsInterval = setInterval(async () => {
          const stats = await getCallStats(peerConnection);
          if (stats) {
            const quality = stats.video?.packetsLost < 5 ? 'good' : 
                          stats.video?.packetsLost < 10 ? 'fair' : 'poor';
            setCallQuality(quality);
          }
        }, 5000);

        return () => {
          clearInterval(timerRef.current);
          clearInterval(statsInterval);
        };
      } catch (error) {
        console.error('Error setting up media:', error);
        setError('Failed to access camera and microphone');
        setPermissionsGranted(false);
      }
    };

    setupMedia();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [params.id, user.uid]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const handleEndCall = async () => {
    try {
      await endCall(params.id);
      stopRingback();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error ending call:', error);
      setError('Failed to end call');
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!permissionsGranted) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Camera and Microphone Access Required</h2>
          <p className="mb-4">Please allow access to your camera and microphone to continue.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Local Video (Picture-in-Picture) */}
      <div className="absolute bottom-24 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </div>

      {/* Call Status */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
        {callStatus === 'connecting' ? 'Connecting...' : 
         callStatus === 'connected' ? `Connected (${formatDuration(callDuration)})` : 
         'Call Ended'}
      </div>

      {/* Call Quality Indicator */}
      {callStatus === 'connected' && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
          Quality: {callQuality}
        </div>
      )}

      {/* Call Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full ${
            isMuted ? 'bg-red-500' : 'bg-gray-600'
          } text-white hover:bg-opacity-80`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${
            isVideoOff ? 'bg-red-500' : 'bg-gray-600'
          } text-white hover:bg-opacity-80`}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>

        <button
          onClick={handleEndCall}
          className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
}
