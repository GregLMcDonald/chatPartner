import React, { useState, useRef, useEffect } from 'react';
import Conversation from './Conversation';

const AudioRecorder = ({ onSubmit }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState([]);

  const transcriptRef = useRef(transcript);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }
  }, [isRecording]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // const getTime = () => {
  //   const date = new Date();
  //   const hours = date.getHours();
  //   const minutes = date.getMinutes();
  //   const seconds = date.getSeconds();
  //   const milliseconds = date.getMilliseconds();
  //   return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  // };


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

  const textToSpeech = (text, lang = 'en-US', voiceName = '') => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      // Find the voice by name if provided, otherwise use the default voice for the language
      const voices = synth.getVoices();
      const voice = voices.find((v) => v.lang === lang && (voiceName ? v.name === voiceName : true));
      utterance.voice = voice || voices.find((v) => v.lang === lang);

      synth.speak(utterance);
    } else {
      alert('Sorry, speech synthesis is not supported by your browser.');
    }
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

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended.', transcriptRef.current);
        textToSpeech(transcriptRef.current, 'de-DE', 'Google Deutsch');
        setConversation((prevConversation) => {
          return [...prevConversation, { type: 'bot', text: transcriptRef.current }];
        });
      };

      recognitionRef.current.start();
    } else {
      alert('Speech Recognition API is not supported by your browser.');
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      console.log('Stopping speech recognition...');
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
          Aufnahme starten
        </button>

        {isRecording && <div className="recording-indicator active"></div>}
        {!isRecording && <div className="recording-indicator"></div>}

        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="px-4 py-2 text-lg font-semibold rounded-lg shadow-md text-white bg-red-500 hover:bg-opacity-90 focus:outline-none"
        >
          Aufnahme stoppen
        </button>
      </div>

      {/* Display the transcript */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold">Gespräch:</p>
          <button
            onClick={clearConversation}
            className="text-sm font-semibold text-red-600 hover:text-red-800 focus:outline-none"
          >
            Gespräch löschen
          </button>
        </div>
        <Conversation conversation={conversation} />
      </div>
    </div>
  );
};

export default AudioRecorder;


// Anna de-DE
// VM1479:1 Eddy (German (Germany)) de-DE
// VM1479:1 Flo (German (Germany)) de-DE
// VM1479:1 Grandma (German (Germany)) de-DE
// VM1479:1 Grandpa (German (Germany)) de-DE
// VM1479:1 Reed (German (Germany)) de-DE
// VM1479:1 Rocko (German (Germany)) de-DE
// VM1479:1 Sandy (German (Germany)) de-DE
// VM1479:1 Shelley (German (Germany)) de-DE
// VM1479:1 Google Deutsch de-DE