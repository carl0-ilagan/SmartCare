"use client"

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './auth-context';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { createCall, endCall } from '@/lib/webrtc';

const CallContext = createContext();

export function CallProvider({ children }) {
  const { user } = useAuth();
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const ringtoneRef = useRef(null);
  const ringbackRef = useRef(null);

  // Initialize audio elements only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ringtoneRef.current = new window.Audio('/sounds/ringtone.mp3');
      ringbackRef.current = new window.Audio('/sounds/ringback.mp3');
      ringtoneRef.current.loop = true;
      ringbackRef.current.loop = true;
    }
  }, []);

  // Listen for incoming calls
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      const userData = doc.data();
      if (userData?.incomingCall) {
        setIncomingCall(userData.incomingCall);
        playRingtone();
      } else {
        setIncomingCall(null);
        stopRingtone();
      }
    });

    return () => unsubscribe();
  }, [user]);

  const playRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.play().catch(console.error);
    }
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

  const startRingback = () => {
    if (ringbackRef.current) {
      ringbackRef.current.play().catch(console.error);
    }
  };

  const stopRingback = () => {
    if (ringbackRef.current) {
      ringbackRef.current.pause();
      ringbackRef.current.currentTime = 0;
    }
  };

  const initiateCall = async (receiverId, callType = 'video') => {
    try {
      const callId = await createCall(user.uid, receiverId, callType);
      setActiveCall({ id: callId, type: callType });
      startRingback();
      return callId;
    } catch (error) {
      console.error('Error initiating call:', error);
      throw error;
    }
  };

  const answerCall = async (callId) => {
    try {
      const callRef = doc(db, 'calls', callId);
      await updateDoc(callRef, {
        status: 'connected',
        answeredAt: new Date().toISOString()
      });
      stopRingtone();
      setActiveCall({ id: callId, type: incomingCall?.type });
      setIncomingCall(null);
    } catch (error) {
      console.error('Error answering call:', error);
      throw error;
    }
  };

  const rejectCall = async (callId) => {
    try {
      await endCall(callId);
      stopRingtone();
      setIncomingCall(null);
    } catch (error) {
      console.error('Error rejecting call:', error);
      throw error;
    }
  };

  const hangupCall = async (callId) => {
    try {
      await endCall(callId);
      stopRingback();
      setActiveCall(null);
    } catch (error) {
      console.error('Error hanging up call:', error);
      throw error;
    }
  };

  // Cleanup audio elements on unmount
  useEffect(() => {
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
      }
      if (ringbackRef.current) {
        ringbackRef.current.pause();
      }
    };
  }, []);

  return (
    <CallContext.Provider
      value={{
        incomingCall,
        activeCall,
        initiateCall,
        answerCall,
        rejectCall,
        hangupCall,
        startRingback,
        stopRingback
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}
