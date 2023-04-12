import axios from 'axios';

const textToSpeech = (text, language, voiceName, usePolly) => {
  if (usePolly) {
    return textToSpeechPolly(text, language, voiceName);
  } else {
    return textToSpeechBrowser(text, language, voiceName);
  }
};

const textToSpeechBrowser = (text, language, voiceName) => {
  if (!text) {
    return;
  }
  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;

    const voices = synth.getVoices();
    const voice = voices.find((v) => v.name === voiceName);
    utterance.voice = voice;

    synth.speak(utterance);
  } else {
    alert('Sorry, speech synthesis is not supported by your browser.');
  }
};

const textToSpeechPolly = async (text, language, voiceName) => {
  if (!text) {
    return;
  }
  const response = await axios.post('https://5arusik4qa.execute-api.ca-central-1.amazonaws.com/prod/api/text-to-speech', { text, language, voiceName });
  const { AudioStream: { data }, ContentType } = response.data;

  const uInt8Array = new Uint8Array(data);
  const arrayBuffer = uInt8Array.buffer;
  const blob = new Blob([arrayBuffer], { type: ContentType });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play();
}

export default textToSpeech;