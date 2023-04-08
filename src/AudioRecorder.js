import React, { useState, useRef, useEffect } from 'react';
import Conversation from './Conversation';

const AudioRecorder = ({ onSubmit }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState([]);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }
  }, [isRecording]);


  const addPunctuation = (text) => {
    const punctuationMap = {
      'Punkt': '.',
      'Komma': ',',
      'Ausrufezeichen': '!',
      'Fragezeichen': '?',
      'Semikolon': ';',
      'Doppelpunkt': ':',
    };

    const words = text.split(' ');
    const processedWords = words.map((word) => {
      return punctuationMap[word] || word;
    });

    return processedWords.join(' ');
  };


  const startSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'de-DE';

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }

        const punctuatedTranscript = addPunctuation(currentTranscript);
        setTranscript(punctuatedTranscript);
        // Update the last conversation message with the current transcript
        setConversation((prevConversation) => {
          const lastMessage = prevConversation[prevConversation.length - 1];
          if (lastMessage && lastMessage.type === 'user') {
            lastMessage.text = punctuatedTranscript;
            return [...prevConversation.slice(0, -1), lastMessage];
          } else {
            return [...prevConversation, { type: 'user', text: punctuatedTranscript }];
          }
        });
      };

      recognitionRef.current.start();
    } else {
      alert('Speech Recognition API is not supported by your browser.');
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const clearConversation = () => {
    setConversation([]);
  };


  return (
    <div className="mb-8">
      <div className="mb-4 flex flex-row items-center justify-center">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="px-4 py-2 text-lg font-semibold rounded-lg shadow-md text-white bg-blue-500 hover:bg-opacity-90 focus:outline-none mr-2"
        >
          Start Recording
        </button>

        {isRecording && <div className="recording-indicator active"></div>}
        {!isRecording && <div className="recording-indicator"></div>}

        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="px-4 py-2 text-lg font-semibold rounded-lg shadow-md text-white bg-red-500 hover:bg-opacity-90 focus:outline-none"
        >
          Stop Recording
        </button>
      </div>

      {/* Display the transcript */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold">Conversation:</p>
          <button
            onClick={clearConversation}
            className="text-sm font-semibold text-red-600 hover:text-red-800 focus:outline-none"
          >
            Clear Conversation
          </button>
        </div>
        <Conversation conversation={conversation} />
      </div>
    </div>
  );
};

export default AudioRecorder;
