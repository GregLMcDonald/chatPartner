import React from 'react';
import './custom.css';
import AudioRecorder from './AudioRecorder';

function App() {
  const [language, setLanguage] = React.useState('German');

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">
        Let's chat in{' '}
        <select
          value={language}
          onChange={handleLanguageChange}
          className="text-4xl font-bold bg-transparent focus:outline-none"
        >
          <option value="de-DE">German!</option>
          <option value="fr-CA">French!</option>
          <option value="en-CA">English!</option>
          <option value="jp-JP">Japanese!</option>
        </select>
      </h1>
      <AudioRecorder />
    </div>
  );
}

export default App;
