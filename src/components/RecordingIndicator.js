import React from "react";

const RecordingIndicator = ({ isRecording }) => (
  <>
    {isRecording && <div className="recording-indicator active"></div>}
    {!isRecording && <div className="recording-indicator"></div>}
  </>
)

export default RecordingIndicator;