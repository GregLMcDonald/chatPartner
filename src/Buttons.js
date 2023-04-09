import React from "react";

const iconColor = (isRecording) => {
  return isRecording ? "#999" : "#f00";
};

const buttonClass = (isDisabled) => `px-1 py-1 text-xl font-semibold rounded-lg shadow-md text-white bg-gray-200 focus:outline-none mr-2 relative ${isDisabled ? "cursor-not-allowed" : "hover:bg-gray-300"}`

export const RecordButton = ({ isRecording, startRecording }) => (
  <button
    onClick={startRecording}
    disabled={isRecording}
    className={buttonClass(isRecording)}
  >
    <svg
      className="w-16 h-16 text-white"
      fill={iconColor(isRecording)}
      stroke={iconColor(isRecording)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="5" />
    </svg>
  </button>
);

export const StopButton = ({ isRecording, stopRecording }) => (
  <button
    onClick={stopRecording}
    disabled={!isRecording}
    className={buttonClass(!isRecording)}
  >
    <svg
      className="w-16 h-16 text-white"
      fill={iconColor(!isRecording)}
      stroke={iconColor(!isRecording)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="8" y="8" width="8" height="8"/>
    </svg>
  </button>
);