import React, { useState, useRef } from 'react';

const AudioRecorder = ({ onSubmit }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorder = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.start();

    mediaRecorder.current.addEventListener('dataavailable', (e) => {
      setAudioURL(URL.createObjectURL(e.data));
    });

    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);

      if (onSubmit) {
        onSubmit(audioURL);
      }
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-4 py-2 text-lg font-semibold rounded-lg shadow-md text-white ${
          recording ? 'bg-red-500' : 'bg-blue-500'
        } hover:bg-opacity-90 focus:outline-none`}
      >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioURL && (
        <div className="mt-4">
          <p className="font-semibold">Recorded Audio:</p>
          <audio src={audioURL} controls />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
