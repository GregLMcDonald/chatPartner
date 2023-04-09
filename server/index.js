const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


// const configuration = new Configuration({
//       apiKey: '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',
//     });
// const openai = new OpenAIApi(configuration);
// openai.listModels().then((response) => {
//   console.log(response.data);
// });


app.post('/api/gpt', async (req, res) => {
  const { text, language } = req.body;
  try {
    const configuration = new Configuration({
      apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      // model: 'gpt-3.5-turbo',
    //  prompt: `Reply to this in German: ${text}. End with a prompt to continue the conversation.`,
      prompt: `Reply to this statement in a conversation in ${language}: ${text}. Your reply should be a complete sentence and end with a prompt to continue the conversation.`,
      max_tokens: 50,
      temperature: 0.2,
    });

    console.log(response.data);

    res.json({ text: response.data.choices[0].text?.replace(/^[\n]+/, '') });
  } catch (error) {
    console.error('Error calling GPT API:', error);
    res.status(500).json({ error: 'Error calling GPT API' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
