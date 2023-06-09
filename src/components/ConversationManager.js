import React, { useState, useRef, useEffect } from 'react';
import Conversation from './Conversation';
// import axios from 'axios';
import textToSpeech from '../services/textToSpeech';
import { Auth, API } from 'aws-amplify';

const DEFAULT_CUTOFF = 6;

const ConversationManager = ({
  language,
  voiceName,
  historyCutoff = DEFAULT_CUTOFF,
  usePolly = false,
  isRecording,
  setIsRecording,
  isRecordingRef,
}) => {
  const [conversation, setConversation] = useState([]);
  const [isResponding, setIsResponding] = useState(false);

  const conversationRef = useRef(conversation);
  const recognitionRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      setIsRecording((isRecording) => !isRecording);
    }
  };

  useEffect(() => {
    if (isRecording) {
      startSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }
    // eslint-disable-next-line
  }, [isRecording]);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const callGPTAPI = async (messages) => {
    const cleanedMessages = messages.filter((message) => message.type === 'utterance').map(({ role, content}) => ({ role, content}));
    const cutoffMessages = cleanedMessages.slice(Math.max(cleanedMessages.length - historyCutoff, 0));
    try {
      // The calls to the API (which are handled by the thirdpartyhard lambda function) require
      // authentication. The Amplify Auth.currentSession() method returns a promise that resolves
      // with the current session. The session object has a getIdToken() method that returns a
      // promise that resolves with the current id token. The id token has a getJwtToken() method
      // that returns the actual JWT token. The JWT token is passed in the Authorization header
      // of the API call.
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      const myInit = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: { messages: cutoffMessages, language },
      };

      // Because Amplify is configured in index.js, the API methods (post(),
      // etc.) know how to interact with the AWS services that are used in the
      // app. The API.post() method makes a POST request to the /gpt endpoint of
      // the thirdpartyhard lambda function. The URL to use for the API is
      // provided through the Amplify configuration. The thirdpartyhard lambda
      // function is configured to proxy the request to the GPT-3 API.

      const response = await API.post("thirdpartyhard", `/gpt`, myInit);
      const { role, content } = response;
      return { type: 'utterance', role, content, language }
    } catch (error) {
      return { type: 'error', content:  'Oops.', language }
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
        let resultsUseConfidence = false;
        for (let i = 0; i < event.results.length; ++i) {
          const result = event.results[i][0];
          if (result.confidence > 0.0) {
            resultsUseConfidence = true;
            break
          }
        }
        if (resultsUseConfidence) {
          for (let i = 0; i < event.results.length; ++i) {
            const result = event.results[i][0];
            if (result.confidence > 0.0) {
              currentTranscript += result.transcript;
            }
          }
        } else {
          const result = event.results[event.results.length - 1][0];
          currentTranscript += result.transcript;
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
        if (isRecordingRef.current) {
          recognitionRef.current.start();
        } else {
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
        }
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

  const clearConversation = () => {
    setConversation([]);
  };

  return (
    <div className="mb-6 flex-grow flex flex-col overflow-auto">
      <Conversation conversation={conversation}  clearConversation={clearConversation} historyCutoff={historyCutoff} loading={isResponding} />
    </div>
  );
};

export default ConversationManager;



