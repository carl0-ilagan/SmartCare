"use client"

import { useRouter } from 'next/navigation';
import { useCall } from '@/contexts/call-context';
import { Phone, Video, X } from 'lucide-react';

export default function CallNotification() {
  const router = useRouter();
  const { incomingCall, answerCall, rejectCall } = useCall();

  if (!incomingCall) return null;

  const handleAnswer = async () => {
    try {
      await answerCall(incomingCall.id);
      router.push(`/dashboard/calls/${incomingCall.type}/${incomingCall.id}`);
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectCall(incomingCall.id);
    } catch (error) {
      console.error('Error rejecting call:', error);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-80 bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {incomingCall.type === 'video' ? (
            <Video className="h-5 w-5 text-blue-500 mr-2" />
          ) : (
            <Phone className="h-5 w-5 text-blue-500 mr-2" />
          )}
          <h3 className="font-medium">
            {incomingCall.type === 'video' ? 'Incoming Video Call' : 'Incoming Voice Call'}
          </h3>
        </div>
        <button onClick={handleReject} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
          {incomingCall.callerPhoto ? (
            <img
              src={incomingCall.callerPhoto}
              alt={incomingCall.callerName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {incomingCall.callerName?.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div>
          <p className="font-medium">{incomingCall.callerName}</p>
          <p className="text-sm text-gray-500">
            {incomingCall.type === 'video' ? 'Video Call' : 'Voice Call'}
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleReject}
          className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Decline
        </button>
        <button
          onClick={handleAnswer}
          className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Answer
        </button>
      </div>
    </div>
  );
}
