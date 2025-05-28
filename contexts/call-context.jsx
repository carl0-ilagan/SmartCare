"use client"

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './auth-context';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { createCall, endCall } from '@/lib/webrtc';

const CallContext = createContext();

export function CallProvider({ children }) {
  const { user } = useAuth();
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const ringtoneRef = useRef(null);
  const ringbackRef = useRef(null);
  const [audioLoaded, setAudioLoaded] = useState(false);

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        ringtoneRef.current = new window.Audio('/sounds/ringtone.mp3');
        ringbackRef.current = new window.Audio('/sounds/ringback.mp3');
        
        // Set up audio event listeners
        const handleAudioLoad = () => setAudioLoaded(true);
        const handleAudioError = (error) => {
          console.error('Error loading audio:', error);
          setAudioLoaded(false);
        };

        ringtoneRef.current.addEventListener('canplaythrough', handleAudioLoad);
        ringbackRef.current.addEventListener('canplaythrough', handleAudioLoad);
        ringtoneRef.current.addEventListener('error', handleAudioError);
        ringbackRef.current.addEventListener('error', handleAudioError);

        // Preload audio
        ringtoneRef.current.load();
        ringbackRef.current.load();

        ringtoneRef.current.loop = true;
        ringbackRef.current.loop = true;

        return () => {
          if (ringtoneRef.current) {
            ringtoneRef.current.removeEventListener('canplaythrough', handleAudioLoad);
            ringtoneRef.current.removeEventListener('error', handleAudioError);
          }
          if (ringbackRef.current) {
            ringbackRef.current.removeEventListener('canplaythrough', handleAudioLoad);
            ringbackRef.current.removeEventListener('error', handleAudioError);
          }
        };
      } catch (error) {
        console.error('Error initializing audio:', error);
        setAudioLoaded(false);
      }
    }
  }, []);

  // Listen for incoming calls
  useEffect(() => {
    if (!user) return;

    const callsQuery = query(
      collection(db, 'calls'),
      where('receiverId', '==', user.uid),
      where('status', '==', 'calling')
    );

    const unsubscribe = onSnapshot(callsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const callData = change.doc.data();
          setIncomingCall({
            id: change.doc.id,
            ...callData,
          });
          playRingtone();
        }
      });
    });

    return () => unsubscribe();
  }, [user]);

  const playRingtone = () => {
    if (ringtoneRef.current && audioLoaded) {
      ringtoneRef.current.play().catch(error => {
        console.error('Error playing ringtone:', error);
      });
    }
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

  const startRingback = () => {
    if (ringbackRef.current && audioLoaded) {
      ringbackRef.current.play().catch(error => {
        console.error('Error playing ringback:', error);
      });
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
      // Check if receiver is available
      const receiverQuery = query(
        collection(db, 'calls'),
        where('receiverId', '==', receiverId),
        where('status', 'in', ['calling', 'connected'])
      );
      const receiverSnapshot = await getDocs(receiverQuery);
      
      if (!receiverSnapshot.empty) {
        throw new Error('User is currently in another call');
      }

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
