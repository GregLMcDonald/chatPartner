import React, { useEffect, useState} from 'react';
import './custom.css';
import ConversationManager from './components/ConversationManager';
import LanguageSelectorTitle from './components/LanguageSelectorTitle';
import VoiceSelectorHeading from './components/VoiceSelectorHeading';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';


const LANGUAGE_OPTIONS = [
  { label: 'German ', value: 'de-DE' },
  { label: 'French ', value: 'fr-FR' },
  { label: 'English ', value: 'en-US' },
  { label: 'Japanese ', value: 'ja-JP' },
];

const POLLY_VOICES = {
  'de-DE': ['Vicki', 'Daniel'],
  'en-US': ['Ruth', 'Matthew', 'Joanna'],
  'fr-FR': ['Gabrielle', 'Remi'],
  'ja-JP': ['Kazuha', 'Takumi', 'Tomoko'],
};

const getGoogleVoice = (voices) => {
  return (voices || []).find((voice) => voice.includes('Google'));
};

function App({ signOut, user }) {
  const [language, setLanguage] = useState('en-US');
  const [availableVoices, setAvailableVoices] = useState([]);
  const [voiceName, setVoiceName] = useState('');
  const [usePolly, setUsePolly] = useState(true);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleVoiceChange = (event) => {
    setVoiceName(event.target.value);
  };

  const handleTextToSpeechSelectionChange = (event) => {
    setUsePolly(event.target.value === 'polly');
  };

  const handlePollyVoiceChange = (event) => {
    setVoiceName(event.target.value);
  };

  const handleVoicesChanged = () => {
    const voices = window.speechSynthesis.getVoices();
    const result = LANGUAGE_OPTIONS.reduce((acc, option) => {
      const voiceNames = voices.filter((voice) => voice.lang === option.value).map((voice) => voice.name);
      acc[option.value] = voiceNames;
      return acc;
    }, {});
    setAvailableVoices(result);
  };

  useEffect(() => {
    if (usePolly) {
      setVoiceName(POLLY_VOICES[language][0]);
    } else {
      const voiceName = getGoogleVoice(availableVoices[language]);
      setVoiceName(voiceName);
    }
  }, [language, usePolly, availableVoices]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    }
  }, []);

  return (
    <div className="App min-h-screen py-4 px-8 bg-gray-100 flex flex-col items-center justify-flex-start">
      <div>
        <button className="absolute top-2 right-4 text-red-500 font-semibold hover:text-red-600 py-2 px-4 rounded-lg shadow-none" onClick={signOut}>Sign out</button>
        <LanguageSelectorTitle options={LANGUAGE_OPTIONS} language={language} onChange={handleLanguageChange} />
        {false && <VoiceSelectorHeading options={availableVoices[language]} voiceName={voiceName} onChange={handleVoiceChange} /> }
        <ConversationManager language={language} voiceName={voiceName} usePolly={usePolly} />
        <div className="flex flex-row justify-center items-start">
          <select value={usePolly ? 'polly' : 'browser'} className="w-half border-gray-300 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleTextToSpeechSelectionChange}>
            <option value="browser">Browser</option>
            <option value="polly">Amazon Polly</option>
          </select>
          <select value={voiceName} className="w-half border-gray-300 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handlePollyVoiceChange}>
            {POLLY_VOICES[language].map((voice) => <option key={voice} value={voice}>{voice}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
