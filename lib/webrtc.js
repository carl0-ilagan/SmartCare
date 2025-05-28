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

// ICE servers configuration
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
};

// Create a new call
export const createCall = async (callerId, receiverId, callType) => {
  try {
    const callRef = await addDoc(collection(db, 'calls'), {
      callerId,
      receiverId,
      type: callType,
      status: 'calling',
      createdAt: new Date().toISOString(),
      offer: null,
      answer: null,
      iceCandidates: [],
    });

    return callRef.id;
  } catch (error) {
    console.error('Error creating call:', error);
    throw error;
  }
};

// Initialize peer connection
export const initializePeerConnection = (callId, onIceCandidate, onConnectionStateChange) => {
  const peerConnection = new RTCPeerConnection(iceServers);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };

  peerConnection.onconnectionstatechange = () => {
    onConnectionStateChange(peerConnection.connectionState);
  };

  return peerConnection;
};

// Create and send offer
export const createOffer = async (peerConnection, callId) => {
  try {
    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    await peerConnection.setLocalDescription(offer);

    await updateDoc(doc(db, 'calls', callId), {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    });

    return offer;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
};

// Handle incoming offer
export const handleOffer = async (peerConnection, callId, offer) => {
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    await updateDoc(doc(db, 'calls', callId), {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    });

    return answer;
  } catch (error) {
    console.error('Error handling offer:', error);
    throw error;
  }
};

// Handle incoming answer
export const handleAnswer = async (peerConnection, answer) => {
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  } catch (error) {
    console.error('Error handling answer:', error);
    throw error;
  }
};

// Collect ICE candidates
export const collectIceCandidates = (callId, peerConnection) => {
  const candidatesRef = collection(db, `calls/${callId}/candidates`);
  
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      await addDoc(candidatesRef, {
        candidate: event.candidate,
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Add existing candidates
  onSnapshot(candidatesRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = change.doc.data().candidate;
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
          .catch(error => console.error('Error adding ICE candidate:', error));
      }
    });
  });
};

// End call
export const endCall = async (callId) => {
  try {
    await updateDoc(doc(db, 'calls', callId), {
      status: 'ended',
      endedAt: new Date().toISOString(),
    });

    // Clean up ICE candidates
    const candidatesRef = collection(db, `calls/${callId}/candidates`);
    const candidatesSnapshot = await candidatesRef.get();
    const deletePromises = candidatesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error ending call:', error);
    throw error;
  }
};

// Get call statistics
export const getCallStats = async (peerConnection) => {
  try {
    const stats = await peerConnection.getStats();
    let audioStats = null;
    let videoStats = null;

    stats.forEach(report => {
      if (report.type === 'inbound-rtp' && report.kind === 'audio') {
        audioStats = {
          packetsLost: report.packetsLost,
          jitter: report.jitter,
          timestamp: report.timestamp,
        };
      } else if (report.type === 'inbound-rtp' && report.kind === 'video') {
        videoStats = {
          packetsLost: report.packetsLost,
          framesDropped: report.framesDropped,
          timestamp: report.timestamp,
        };
      }
    });

    return {
      audio: audioStats,
      video: videoStats,
      connectionState: peerConnection.connectionState,
      iceConnectionState: peerConnection.iceConnectionState,
    };
  } catch (error) {
    console.error('Error getting call stats:', error);
    return null;
  }
}; 