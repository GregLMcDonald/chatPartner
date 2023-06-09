// import axios from 'axios';
import { Auth, API } from 'aws-amplify';

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

  // The API is setup to only accepts request from authenticated users. The
  // Authorization header is set to the current user's JWT token. The
  // thirdpartyhard lambda function is configured to proxy the request to the
  // AWS Polly API.
  const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`,
          'Content-Type': 'application/json',
        },
        body: { text, language, voiceName },
      };
  const response = await API.post("thirdpartyhard", '/text-to-speech', myInit);
  const { AudioStream: { data }, ContentType } = response;

  const uInt8Array = new Uint8Array(data);
  const arrayBuffer = uInt8Array.buffer;
  const blob = new Blob([arrayBuffer], { type: ContentType });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play();
}

export default textToSpeech;