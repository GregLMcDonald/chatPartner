import React, { useEffect, useState} from 'react';
import './custom.css';
import ConversationManager from './components/ConversationManager';
import LanguageSelectorTitle from './components/LanguageSelectorTitle';
import VoiceSelectorHeading from './components/VoiceSelectorHeading';

const LANGUAGE_OPTIONS = [
  { label: 'German ', value: 'de-DE' },
  { label: 'French ', value: 'fr-FR' },
  { label: 'English ', value: 'en-US' },
  { label: 'Japanese ', value: 'ja-JP' },
];

const getGoogleVoice = (voices) => {
  return (voices || []).find((voice) => voice.includes('Google'));
};


function App() {
  const [language, setLanguage] = useState('en-US');
  const [availableVoices, setAvailableVoices] = useState([]);
  const [voiceName, setVoiceName] = useState('');

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    const googleVoiceName = getGoogleVoice(availableVoices[event.target.value]);
    if (googleVoiceName) {
      setVoiceName(googleVoiceName);
    }
  };

  const handleVoiceChange = (event) => {
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
    const googleVoiceName = getGoogleVoice(result[language]);
    if (googleVoiceName) {
      setVoiceName(googleVoiceName);
    }
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    }
  }, []);

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <LanguageSelectorTitle options={LANGUAGE_OPTIONS} language={language} onChange={handleLanguageChange} />
      <VoiceSelectorHeading options={availableVoices[language]} voiceName={voiceName} onChange={handleVoiceChange} />
      <ConversationManager language={language} voiceName={voiceName} />
    </div>
  );
}

export default App;
