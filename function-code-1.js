/* eslint-disable no-use-before-define */
exports.handler = async (context, event, callback) => {
  const response = {};

  response.actions = await fallbackHandler(event);

  callback(null, response);
};

const fallbackHandler = (event) => {
  const actions = [];

  actions.push({ say: `I heard you say: ${event.CurrentInput}` });
  actions.push({ listen: true });

  return actions;
};
