import React, { useState, useRef, useEffect } from 'react';
import Conversation from './Conversation';
import axios from 'axios';
import { RecordButton, StopButton } from './Buttons';
import RecordingIndicator from './RecordingIndicator';
import textToSpeech from '../services/textToSpeech';

const DEFAULT_CUTOFF = 6;

const ConversationManager = ({
  language,
  voiceName,
  historyCutoff = DEFAULT_CUTOFF,
  usePolly = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [isResponding, setIsResponding] = useState(false);

  const conversationRef = useRef(conversation);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }
  }, [isRecording]);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  const callGPTAPI = async (messages) => {
    const cleanedMessages = messages.filter((message) => message.type === 'utterance').map(({ role, content}) => ({ role, content}));
    const cutoffMessages = cleanedMessages.slice(Math.max(cleanedMessages.length - historyCutoff, 0));
    try {
      const response = await axios.post('http://localhost:3001/api/gpt', { messages: cutoffMessages, language });
      const { role, content } = response.data;
      return { type: 'utterance', role, content, language }
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

        // Update the last conversation message with the current transcript.
        // This is what makes the transcript appear to be continuously updated.
        setConversation((prevConversation) => {
          const lastMessage = prevConversation[prevConversation.length - 1];
          if (lastMessage && lastMessage.type === 'utterance' && lastMessage.role === 'user') {
            lastMessage.content = currentTranscript;
            return [...prevConversation.slice(0, -1), lastMessage];
          } else {
            return [...prevConversation, { type: 'utterance', role: 'user', content: currentTranscript }];
          }
        });
      };

      recognitionRef.current.onend = () => {
        setIsResponding(true);
        callGPTAPI(conversationRef.current).then((response) => {
          setIsResponding(false);
          const { type, content } = response;
          if (type !== 'error') {
            textToSpeech(content, language, voiceName, usePolly);
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
      <Conversation conversation={conversation} clearConversation={clearConversation} historyCutoff={historyCutoff} loading={isResponding} />
    </div>
  );
};

export default ConversationManager;



