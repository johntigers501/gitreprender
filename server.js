const line = require('@line/bot-sdk');
const moment = require('moment-timezone');
require('dotenv').config();

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

// Function to send a welcome message to a user
function sendWelcomeMessage(userId) {
    const welcomeMessage = {
        type: 'text',
        text: 'Welcome to Line Bot.', // Welcome message text
    };

    client.pushMessage(userId, welcomeMessage)
        .then(() => {
            console.log('Sent welcome message to user:', userId);
        })
        .catch((err) => {
            console.error('Error sending welcome message:', err.response ? err.response.data : err);
        });
}

// Webhook function to handle incoming events
function handleWebhook(req, res) {
    const events = req.body.events;

    events.forEach((event) => {
        if (event.type === 'follow') {
            const userId = event.source.userId;
            sendWelcomeMessage(userId); // Send welcome message when followed
        } else if (event.type === 'join') {
            const groupId = event.source.groupId;
            const joinMessage = {
                type: 'text',
                text: 'Hello everyone! I have joined this group!',
            };
            client.replyMessage(event.replyToken, joinMessage)
                .then(() => {
                    console.log('Sent join message in group');
                })
                .catch((err) => {
                    console.error(err);
                });
        } else if (event.type === 'leave') {
            console.log(`Bot left group: ${event.source.groupId}`);
        } else if (event.type === 'message' && event.message.type === 'text') {
            const replyToken = event.replyToken;
            const message = event.message.text;
            const sourceType = event.source.type; // user or group
            const userId = event.source.userId;

            if (sourceType === 'user') {
                handleUserMessage(replyToken, message, userId);
            } else if (sourceType === 'group') {
                handleGroupMessage(replyToken, message, userId, event.source.groupId);
            }
        }
    });

    res.status(200).end();
}

// Function to handle messages from users
function handleUserMessage(replyToken, message, userId) {
    client.getProfile(userId)
        .then((profile) => {
            const userName = profile.displayName;
            const replyMessage = {
                type: 'text',
                text: `You said: ${message}\nFrom: ${userName}`,
            };
            return client.replyMessage(replyToken, replyMessage);
        })
        .then(() => {
            console.log('Message replied in 1:1 chat');
        })
        .catch((err) => {
            console.error(err);
        });
}

// Function to handle messages in groups
function handleGroupMessage(replyToken, message, userId, groupId) {
    client.getProfile(userId)
        .then((profile) => {
            const userName = profile.displayName;
            const replyMessage = {
                type: 'text',
                text: `You said: ${message}\nFrom: ${userName} in group: ${groupId}`,
            };
            return client.replyMessage(replyToken, replyMessage);
        })
        .then(() => {
            console.log('Message replied in group');
        })
        .catch((err) => {
            console.error(err);
        });
}

// Function to handle Dialogflow webhook (if applicable)
function handleDialogflowWebhook(req, res) {
    const city = req.body.queryResult.parameters['location']; // Extract city name from parameters

    // Use moment-timezone to get current time for specified city
    const currentTime = moment().tz(city).format('HH:mm');

    let responseText = `The current time in ${city} is ${currentTime}.`;

    return res.json({
        fulfillmentText: responseText,  // Send current time back to Dialogflow
    });
}

// Export functions to be used in index.js
module.exports = {
    handleWebhook,
    handleDialogflowWebhook,
};
