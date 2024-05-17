const slackWebhook = require('@slack/webhook');
const webHook = new slackWebhook.IncomingWebhook(process.env.SLACK_WEBHOOK);

const loggerStream = {
  write: (message) => {
    webHook.send({ text: message });
    //console.log('Capturando el LOG', message);
  },
};

module.exports = loggerStream;
