const express = require('express');
const cors = require('cors');
const axios = require('axios');

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

app.post('/api/gpt', async (req, res) => {
  const { messages, language } = req.body;
  try {
    axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {role: "system", content: `You are a ${language} conversation partner. Keep your response very short and to the point but alway finish with a prompt to further the conversation. Use at most twice the number of words as the user's last message.`},
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
