const express = require('express');
const cors = require('cors');
const axios = require('axios');
const AWS = require('aws-sdk');

require('dotenv').config();
const openaiKey = process.env.OPENAI_KEY;

const app = express();
app.use(express.json());
app.use(cors());

const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openaiKey}`,
  },
};

// Create a new instance of Polly
const polly = new AWS.Polly({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Define a route to handle text-to-speech requests
app.post('/api/text-to-speech', async (req, res) => {
  const { text, language, voiceName } = req.body;

  // Set the options for the synthesis task
  const params = {
    Engine: 'neural',
    LanguageCode: language,
    OutputFormat: 'mp3',
    Text: text,
    TextType: 'text',
    VoiceId: voiceName, // POLLY_VOICES[language][1],
  };

  // Use Polly to synthesize the speech
  polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error calling Polly API' });
    } else {
      res.send(data);
    }
  });
});


// const buildSystemContent = (language) => (`You are a ${language} conversation partner. Always finish with a prompt to further the conversation. Keep your replies concise; never use more than twice the number of words as the user's last message.`)
// const buildSystemContent = (language) => (`You are a conversation partner for a user learning ${language}. Be very concise and use simple language.`);
const buildSystemContent = (language) => (`You are a conversation partner for a user learning ${language}. Always use simple language. Maximum reply length is 10 words.`);

app.post('/api/gpt', async (req, res) => {
  const { messages, language } = req.body;
  try {
    axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      // model: 'gpt-4', // This is the new model, but it's in closed beta
      messages: [
        {role: "system", content: buildSystemContent(language)},
        ...messages,
      ],
    }, config)
    .then(response => {
      res.json(response.data.choices[0].message);
    })
    .catch(error => {
      console.error('Error calling GPT API:', error);
      res.status(500).json({ error: 'Error calling GPT API' });
    });
  } catch (error) {
    console.error('Error calling GPT API:', error);
    res.status(500).json({ error: 'Error calling GPT API' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
