import React from "react";

const iconColor = (isRecording) => {
  return isRecording ? "#999" : "#f00";
};

const buttonClass = (isDisabled) => `px-1 py-1 text-xl font-semibold rounded-lg shadow-md text-white bg-gray-200 focus:outline-none mr-2 relative ${isDisabled ? "cursor-not-allowed" : "hover:bg-gray-300"}`

const Button = ({ isActive, handleClick, children }) => (
  <button
    onClick={handleClick}
    disabled={isActive}
    className={buttonClass(isActive)}
  >
    <svg
      className="w-16 h-16 text-white"
      fill={iconColor(isActive)}
      stroke={iconColor(isActive)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  </button>
)

export const RecordButton = ({ isRecording, startRecording }) => (
  <Button isActive={isRecording} handleClick={startRecording}>
    <circle cx="12" cy="12" r="5" />
  </Button>
);

export const StopButton = ({ isRecording, stopRecording }) => (
  <Button isActive={!isRecording} handleClick={stopRecording}>
    <rect x="8" y="8" width="8" height="8"/>
  </Button>
);