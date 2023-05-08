import React, { useEffect, useRef, useState} from 'react';
import './custom.css';
import ConversationManager from './components/ConversationManager';
import LanguageSelectorTitle from './components/LanguageSelectorTitle';
import FloatingRecordButton from './components/FloatingRecordButton';
import { withAuthenticator } from '@aws-amplify/ui-react';
import Select from 'react-select';
import styles from './styles/select';
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
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(isRecording);

  const handleTextToSpeechSelectionChange = (option) => {
    setUsePolly(option.value === 'polly');
  };

  const handlePollyVoiceChange = (option) => {
    setVoiceName(option.value);
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

  const handleClick = () => {
    setIsRecording(!isRecording);
  };

  const voiceOptions = [
    { value: 'polly', label: 'Polly' },
    { value: 'browser', label: 'Browser' },
  ];
  const selectedVoiceOption = usePolly ? voiceOptions[0] : voiceOptions[1];

  const pollyOptions = POLLY_VOICES[language].map((voice) => ({ value: voice, label: voice }));
  const selectedPollyOption = pollyOptions.find((option) => option.value === voiceName);


  return (
    <div className="App min-h-screen max-h-screen p-4 bg-gray-100 flex flex-col items-center justify-flex-start">
      <button className="absolute top-3 right-4 text-red-500 font-semibold hover:text-red-600 rounded-lg shadow-none" onClick={signOut}>Sign out</button>
      <LanguageSelectorTitle options={LANGUAGE_OPTIONS} language={language} onChange={setLanguage} />
      <ConversationManager
        language={language}
        voiceName={voiceName}
        usePolly={usePolly}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        isRecordingRef={isRecordingRef}
      />
      <div className="flex gap-1 flex-row justify-start items-start" style={{ width: '100%' }}>
        <Select
          value={selectedVoiceOption}
          onChange={handleTextToSpeechSelectionChange}
          options={voiceOptions}
          styles={styles}
          isSearchable={false}
          menuPortalTarget={document.body}
          menuPosition={'fixed'}
          components={{
            IndicatorSeparator: null
          }}
        />
        <Select
          value={selectedPollyOption}
          onChange={handlePollyVoiceChange}
          options={pollyOptions}
          styles={styles}
          isSearchable={false}
          menuPortalTarget={document.body}
          menuPosition={'fixed'}
          components={{
            IndicatorSeparator: null
          }}
        />
        <FloatingRecordButton
          onClick={handleClick}
          isRecording={isRecording}
        />
      </div>
    </div>
  );
}

export default withAuthenticator(App);
