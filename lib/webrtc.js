import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';

// ICE servers for WebRTC
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
};

// Create a new call
export const createCall = async (callerId, receiverId, callType) => {
  try {
    const callRef = await addDoc(collection(db, 'calls'), {
      callerId,
      receiverId,
      type: callType,
      status: 'initiated',
      timestamp: new Date().toISOString(),
      initiatorId: callerId
    });
    return callRef.id;
  } catch (error) {
    console.error('Error creating call:', error);
    throw error;
  }
};

// Initialize peer connection
export const initializePeerConnection = async () => {
  try {
    const pc = new RTCPeerConnection(iceServers);
    
    // Handle ICE connection state changes
    pc.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
        console.error('ICE connection failed or disconnected');
      }
    };

    // Handle ICE gathering state changes
    pc.onicegatheringstatechange = () => {
      console.log('ICE Gathering State:', pc.iceGatheringState);
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection State:', pc.connectionState);
      if (pc.connectionState === 'failed') {
        console.error('Connection failed');
      }
    };

    return pc;
  } catch (error) {
    console.error('Error initializing peer connection:', error);
    throw error;
  }
};

// Create and set local offer
export const createOffer = async (pc) => {
  try {
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    await pc.setLocalDescription(offer);
    return offer;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
};

// Handle incoming offer
export const handleOffer = async (callId, offer) => {
  try {
    const callRef = doc(db, 'calls', callId);
    await updateDoc(callRef, { offer });
  } catch (error) {
    console.error('Error handling offer:', error);
    throw error;
  }
};

// Handle incoming answer
export const handleAnswer = async (pc, offer) => {
  try {
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  } catch (error) {
    console.error('Error handling answer:', error);
    throw error;
  }
};

// Collect ICE candidates
export const collectIceCandidates = async (pc, callId) => {
  try {
    const callRef = doc(db, 'calls', callId);
    const candidatesRef = collection(callRef, 'candidates');

    // Handle new ICE candidates
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(candidatesRef, {
          candidate: event.candidate,
          timestamp: new Date().toISOString()
        });
      }
    };

    // Add existing candidates
    const candidatesSnapshot = await candidatesRef.get();
    candidatesSnapshot.forEach(doc => {
      const candidate = doc.data().candidate;
      pc.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(error => console.error('Error adding ICE candidate:', error));
    });
  } catch (error) {
    console.error('Error collecting ICE candidates:', error);
    throw error;
  }
};

// End call
export const endCall = async (callId) => {
  try {
    const callRef = doc(db, 'calls', callId);
    await updateDoc(callRef, {
      status: 'ended',
      endedAt: new Date().toISOString()
    });

    // Clean up ICE candidates
    const candidatesRef = collection(callRef, 'candidates');
    const candidatesSnapshot = await candidatesRef.get();
    const deletePromises = candidatesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error ending call:', error);
    throw error;
  }
};

// Get call statistics
export const getCallStats = async (pc) => {
  try {
    const stats = await pc.getStats();
    let audioPacketsLost = 0;
    let videoPacketsLost = 0;

    stats.forEach(report => {
      if (report.type === 'inbound-rtp' && report.kind === 'audio') {
        audioPacketsLost = report.packetsLost || 0;
      }
      if (report.type === 'inbound-rtp' && report.kind === 'video') {
        videoPacketsLost = report.packetsLost || 0;
      }
    });

    return {
      audioPacketsLost,
      videoPacketsLost,
      audioQuality: audioPacketsLost < 5 ? 'good' : audioPacketsLost < 10 ? 'fair' : 'poor',
      videoQuality: videoPacketsLost < 5 ? 'good' : videoPacketsLost < 10 ? 'fair' : 'poor'
    };
  } catch (error) {
    console.error('Error getting call stats:', error);
    return {
      audioPacketsLost: 0,
      videoPacketsLost: 0,
      audioQuality: 'unknown',
      videoQuality: 'unknown'
    };
  }
}; 