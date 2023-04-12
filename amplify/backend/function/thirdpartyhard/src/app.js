/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT *//*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const axios = require('axios');
const AWS = require('aws-sdk');
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const cors = require('cors');

require('dotenv').config();

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(cors());
app.options('*', cors());




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

const buildSystemContent = (language) => (`You are a conversation partner for a user learning ${language}. Always use simple language. Maximum reply length is 10 words.`);

app.post('/api/gpt', async (req, res) => {
  const { messages, language } = req.body;
  const { Parameter } = await (new AWS.SSM())
    .getParameter({
      Name: "OPENAI_KEY",
      WithDecryption: true,
    })
    .promise();
  const openaiKey = Parameter.value;
  const openai_config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`,
    },
  };
  try {
    axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      // model: 'gpt-4', // This is the new model, but it's in closed beta
      messages: [
        {role: "system", content: buildSystemContent(language)},
        ...messages,
      ],
    }, openai_config)
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

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
