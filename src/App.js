import React from 'react';
import './custom.css';
import AudioRecorder from './AudioRecorder';

function App() {
  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Lass uns auf Deutsch plaudern!</h1>
      <AudioRecorder />
    </div>
  );
}

export default App;
