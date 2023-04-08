import React, { useState } from 'react';
import './custom.css';
import AudioRecorder from './AudioRecorder';
import AudioPlayer from './AudioPlayer';

function App() {
  const [responseAudioURL, setResponseAudioURL] = useState('');

  const handleAudioSubmit = async (recordedAudioURL) => {
    // Replace this URL with the endpoint of your serverless function
    const serverlessFunctionURL = 'https://your-serverless-function-url';

    // Fetch the audio Blob from the recorded audio URL
    const audioBlob = await fetch(recordedAudioURL).then((response) => response.blob());

    console.log(audioBlob);
    // // Create a FormData object and append the audio Blob as a file
    // const formData = new FormData();
    // formData.append('audio', audioBlob, 'audio.webm');

    // // Send the FormData object to the serverless function and receive the generated response audio
    // const response = await fetch(serverlessFunctionURL, {
    //   method: 'POST',
    //   body: formData,
    // });

    // if (response.ok) {
    //   const responseAudioBlob = await response.blob();
    //   const responseAudioURL = URL.createObjectURL(responseAudioBlob);
    //   setResponseAudioURL(responseAudioURL);
    // } else {
    //   console.error('Error generating response audio:', response.status, response.statusText);
    // }
  };

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Lass uns auf Deutsch plaudern!</h1>
      <AudioRecorder onSubmit={handleAudioSubmit} />
      <AudioPlayer audioURL={responseAudioURL} />
    </div>
  );
}

export default App;
