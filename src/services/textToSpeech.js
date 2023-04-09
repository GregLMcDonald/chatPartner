const textToSpeech = (text, language, voiceName) => {
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

export default textToSpeech;