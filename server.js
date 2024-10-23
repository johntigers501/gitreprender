const line = require('@line/bot-sdk');
const moment = require('moment-timezone');
require('dotenv').config();

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);

// Function to send a reply message using LINE Messaging API
function replyMessage(replyToken, message) {
    const replyMessage = {
        type: 'text',
        text: message,
    };

    return client.replyMessage(replyToken, replyMessage)
        .then(() => {
            console.log('Message sent successfully');
        })
        .catch((err) => {
            console.error('Error sending message:', err);
        });
}

// Function to handle Webhook for LINE Bot
function handleWebhook(req, res) {
    const events = req.body.events;

    events.forEach((event) => {
        if (event.type === 'follow') {
            const welcomeMessage = 'ยินดีต้อนรับ! ขอบคุณที่เพิ่มฉันเป็นเพื่อน';
            replyMessage(event.replyToken, welcomeMessage);
        } else if (event.type === 'join') {
            const joinMessage = 'สวัสดีทุกคน! ฉันได้เข้าร่วมกลุ่มนี้แล้ว!';
            replyMessage(event.replyToken, joinMessage);
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
            const replyMessageText = `คุณพูดว่า: ${message}\nจาก: ${userName}`;
            return replyMessage(replyToken, replyMessageText);
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
            const replyMessageText = `คุณพูดว่า: ${message}\nจาก: ${userName} ในกลุ่ม: ${groupId}`;
            return replyMessage(replyToken, replyMessageText);
        })
        .then(() => {
            console.log('Message replied in group');
        })
        .catch((err) => {
            console.error(err);
        });
}

// Function to handle Webhook for Dialogflow
function handleDialogflowWebhook(req, res) {
    const city = req.body.queryResult.parameters['location']; // Get city name from parameters

    // Use moment-timezone to get the current time based on the specified city
    const currentTime = moment().tz(city).format('HH:mm');

    let responseText = `เวลาปัจจุบันใน ${city} คือ ${currentTime}.`;

    return res.json({
        fulfillmentText: responseText,  // Send current time back to Dialogflow
    });
}

// Exporting the functions for use in index.js
module.exports = {
    handleWebhook,
    handleDialogflowWebhook
};
