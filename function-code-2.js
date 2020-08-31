/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
const axios = require('axios');

exports.handler = async (context, event, callback) => {
  const response = {};

  response.actions = await fallbackHandler(event);

  callback(null, response);
};

const fallbackHandler = async (event) => {
  const actions = [];

  const instance = axios.create({
    baseURL: 'https://api.openai.com/v1/',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
  });

  const dialog = [
    'bot: Hello, how are you today?',
  ];

  dialog.push(`human: ${event.CurrentInput}`);
  dialog.push('bot:');

  const completionParmas = {
    prompt: dialog.join('\n'),
    max_tokens: 75,
    temperature: 0.65,
    n: 1,
    stream: false,
    logprobs: null,
    echo: false,
    stop: '\n',
  };

  try {
    const result = await instance.post('/engines/davinci/completions', completionParmas);
    const botResponse = result.data.choices[0].text.trim();
    actions.push({ say: botResponse });
  } catch (err) {
    console.log(err);
    actions.push({ say: 'Sorry. Something went wrong. Can you say that again?' });
  }

  actions.push({ listen: true });
  return actions;
};
