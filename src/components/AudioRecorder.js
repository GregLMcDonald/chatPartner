import React, { useState, useRef, useEffect } from 'react';
import Conversation from './Conversation';
import axios from 'axios';
import { RecordButton, StopButton } from './Buttons';
import RecordingIndicator from './RecordingIndicator';
import textToSpeech from '../services/textToSpeech';

const AudioRecorder = ({ language, voiceName }) => {
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

  const callGPTAPI = async (text) => {
    try {
      const response = await axios.post('http://localhost:3001/api/gpt', { text, language });
      return { type: 'bot', text: response.data.text, language }
    } catch (error) {
      return { type: 'error', text: 'Oops.', language }
    }
  };

  const startSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }

        const punctuatedTranscript = addPunctuation(currentTranscript);
        setTranscript(punctuatedTranscript);
        // Update the last conversation message with the current transcript.
        // This is what makes the transcript appear to be continuously updated.
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
        callGPTAPI(transcriptRef.current).then((response) => {
          const { text } = response;
          if (response.type !== 'error') {
            textToSpeech(text, language, voiceName);
          }
          setConversation((prevConversation) => {
            return [...prevConversation, response];
          });
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
      <RecordingIndicator isRecording={isRecording} />
      <div className="mb-4 flex flex-row items-center justify-center">
        <RecordButton isRecording={isRecording} startRecording={startRecording} />
        <StopButton isRecording={isRecording} stopRecording={stopRecording} />
      </div>
      <Conversation conversation={conversation} clearConversation={clearConversation}/>
    </div>
  );
};

export default AudioRecorder;



