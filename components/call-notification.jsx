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
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Incoming {incomingCall.type === 'video' ? 'Video' : 'Voice'} Call
          </h3>
          <button
            onClick={handleReject}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            {incomingCall.type === 'video' ? (
              <Video className="w-6 h-6 text-gray-600" />
            ) : (
              <Phone className="w-6 h-6 text-gray-600" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{incomingCall.callerName}</p>
            <p className="text-sm text-gray-500">
              {incomingCall.type === 'video' ? 'Video Call' : 'Voice Call'}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleAnswer}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            Answer
          </button>
          <button
            onClick={handleReject}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
