"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, where, updateDoc, serverTimestamp } from 'firebase/firestore';

const CallContext = createContext();

export function CallProvider({ children }) {
  const { user } = useAuth();
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);

  useEffect(() => {
    if (!user) return;

    // Listen for incoming calls
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
        }
      });
    });

    return () => unsubscribe();
  }, [user]);

  const answerCall = async (callId) => {
    setIncomingCall(null);
    setActiveCall(callId);
  };

  const rejectCall = async (callId) => {
    // Update call status to rejected
    await updateDoc(doc(db, 'calls', callId), {
      status: 'rejected',
      rejectedAt: serverTimestamp(),
    });
    setIncomingCall(null);
  };

  const endActiveCall = async () => {
    if (activeCall) {
      await endCall(activeCall);
      setActiveCall(null);
    }
  };

  return (
    <CallContext.Provider
      value={{
        incomingCall,
        activeCall,
        answerCall,
        rejectCall,
        endActiveCall,
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
