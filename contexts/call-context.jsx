"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const CallContext = createContext();

export function CallProvider({ children }) {
  const { user } = useAuth();
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [ringtone, setRingtone] = useState(null);
  const [ringback, setRingback] = useState(null);

  useEffect(() => {
    if (!user) return;

    // Initialize audio elements
    const ringtoneAudio = new Audio('/sounds/ringtone.mp3');
    const ringbackAudio = new Audio('/sounds/ringback.mp3');
    ringtoneAudio.loop = true;
    ringbackAudio.loop = true;
    setRingtone(ringtoneAudio);
    setRingback(ringbackAudio);

    // Listen for incoming calls
    const callsRef = collection(db, 'calls');
    const q = query(
      callsRef,
      where('receiverId', '==', user.uid),
      where('status', '==', 'calling')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const callData = change.doc.data();
          setIncomingCall({
            id: change.doc.id,
            ...callData
          });
          // Play ringtone for incoming call
          ringtoneAudio.play().catch(console.error);
        }
        if (change.type === 'removed') {
          setIncomingCall(null);
          ringtoneAudio.pause();
          ringtoneAudio.currentTime = 0;
        }
      });
    });

    return () => {
      unsubscribe();
      ringtoneAudio.pause();
      ringbackAudio.pause();
    };
  }, [user]);

  const answerCall = async (callId) => {
    try {
      const callRef = doc(db, 'calls', callId);
      await updateDoc(callRef, {
        status: 'connected',
        answeredAt: new Date().toISOString()
      });
      setActiveCall(incomingCall);
      setIncomingCall(null);
      if (ringtone) {
        ringtone.pause();
        ringtone.currentTime = 0;
      }
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  const rejectCall = async (callId) => {
    try {
      const callRef = doc(db, 'calls', callId);
      await updateDoc(callRef, {
        status: 'rejected',
        endedAt: new Date().toISOString()
      });
      setIncomingCall(null);
      if (ringtone) {
        ringtone.pause();
        ringtone.currentTime = 0;
      }
    } catch (error) {
      console.error('Error rejecting call:', error);
    }
  };

  const endActiveCall = async () => {
    if (!activeCall) return;
    try {
      const callRef = doc(db, 'calls', activeCall.id);
      await updateDoc(callRef, {
        status: 'ended',
        endedAt: new Date().toISOString()
      });
      setActiveCall(null);
      if (ringback) {
        ringback.pause();
        ringback.currentTime = 0;
      }
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  const startRingback = () => {
    if (ringback) {
      ringback.play().catch(console.error);
    }
  };

  const stopRingback = () => {
    if (ringback) {
      ringback.pause();
      ringback.currentTime = 0;
    }
  };

  return (
    <CallContext.Provider value={{
      incomingCall,
      activeCall,
      answerCall,
      rejectCall,
      endActiveCall,
      startRingback,
      stopRingback
    }}>
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
