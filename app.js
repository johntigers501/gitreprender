const express = require('express');
const bodyParser = require('body-parser');
const { Client, middleware } = require('@line/bot-sdk');

const app = express();
app.use(bodyParser.json());

const config = {
    channelAccessToken: '7JUZAUikpVsD7pQZQfT/4isJaRcWYo3kr6aVATiPuoc8NQvF4wHaBLVWrswTViA6m4g0HmTo4oSXYHLxGMCQC8gaisKzQNyCHsH6mZkhD5/NMrKcBKKqJ+fgYWToNTFFpfZMf3NGlWs16mbFqDKoAdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'f184806624dbdcbf79f775061ed96d7f',
};

const client = new Client(config);

app.post('/webhook', middleware(config), (req, res) => {
    const events = req.body.events;

    Promise.all(events.map(event => {
        if (event.type === 'message' && event.message.type === 'text') {
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: `You said: ${event.message.text}`,
            });
        } else {
            return Promise.resolve(null);
        }
    }))
    .then(() => res.end('OK'))
    .catch((err) => {
        console.error(err);
        res.status(500).end('Error');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
