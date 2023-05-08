import React from 'react';
import { MicrophoneIcon } from '@heroicons/react/24/solid'

const FloatingRecordButton = ({ isRecording, onClick, icon, ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed right-3 bottom-3 w-14 h-14 text-white font-bold py-2 px-4 rounded-full shadow-lg ${
        isRecording ? 'animate-pulse bg-red-500' : 'bg-gray-500 '}
      }`}
      aria-label="Toggle microphone"
    >
      <MicrophoneIcon className="h-6 w-6" />
    </button>
  );
};

export default FloatingRecordButton;
