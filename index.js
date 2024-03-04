const express = require('express');
const bodyParser = require('body-parser');
const { MessengerClient } = require('messaging-api-messenger');

const app = express();
const PORT = process.env.PORT || 3000;
const client = new MessengerClient({
  accessToken: 'EAAPy6y5mZBh8BOZCg7GwSRLNaL0XU2387BNOLtusIOjDol23SHig0ZBZCQbOuic2QfSMMIgKaxWcUiwLSKwSkCdxXTyjSG3R7G5inOSaP8tUxwgJi5crrKRHCVo1UnDvSoVDNcQQS9DQXjrFgc2xn0K5jQzQRZCsIVouM1uZBPTOB6TD7pAZCT3N4TpTiwz',
});

// Body parser middleware
app.use(bodyParser.json());

// Webhook verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === 'Iamnhan') {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// Message handling
app.post('/webhook', (req, res) => {
  const body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const webhookEvent = entry.messaging[0];
      if (webhookEvent.message) {
        const senderId = webhookEvent.sender.id;
        const message = webhookEvent.message.text;
        handleMessage(senderId, message);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

async function handleMessage(senderId, message) {
  try {
    await client.sendText(senderId, 'Hello, I am your chatbot!');
  } catch (err) {
    console.error('Error sending message:', err.message);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Bot is running on port ${PORT}`);
});
