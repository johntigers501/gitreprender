const line = require('@line/bot-sdk');
const moment = require('moment-timezone');
require('dotenv').config();

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};
const client = new line.Client(config);

// ฟังก์ชันจัดการ Webhook สำหรับ Line Bot
function handleWebhook(req, res) {
    const events = req.body.events;

    events.forEach((event) => {
        if (event.type === 'follow') {
            const userId = event.source.userId;
            const welcomeMessage = {
                type: 'text',
                text: 'ยินดีต้อนรับ! ขอบคุณที่เพิ่มฉันเป็นเพื่อน'
            };
            client.replyMessage(event.replyToken, welcomeMessage)
                .then(() => {
                    console.log('Sent welcome message to new friend');
                })
                .catch((err) => {
                    console.error(err);
                });

        } else if (event.type === 'join') {
            const groupId = event.source.groupId;
            const joinMessage = {
                type: 'text',
                text: 'สวัสดีทุกคน! ฉันได้เข้าร่วมกลุ่มนี้แล้ว!'
            };
            client.replyMessage(event.replyToken, joinMessage)
                .then(() => {
                    console.log('Sent join message in group');
                })
                .catch((err) => {
                    console.error(err);
                });

            // Send "Welcome to Line Bot." message when the bot joins a group
            const welcomeToBotMessage = {
                type: 'text',
                text: 'Welcome to Line Bot.'
            };
            client.replyMessage(event.replyToken, welcomeToBotMessage)
                .then(() => {
                    console.log('Sent welcome message after joining group');
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

// ฟังก์ชันสำหรับจัดการข้อความจากผู้ใช้
function handleUserMessage(replyToken, message, userId) {
    client.getProfile(userId)
        .then((profile) => {
            const userName = profile.displayName;
            const replyMessage = {
                type: 'text',
                text: `คุณพูดว่า: ${message}\nจาก: ${userName}`
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

// ฟังก์ชันสำหรับจัดการข้อความในกลุ่ม
function handleGroupMessage(replyToken, message, userId, groupId) {
    client.getProfile(userId)
        .then((profile) => {
            const userName = profile.displayName;
            const replyMessage = {
                type: 'text',
                text: `คุณพูดว่า: ${message}\nจาก: ${userName} ในกลุ่ม: ${groupId}`
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

// ฟังก์ชันสำหรับจัดการ Webhook สำหรับ Dialogflow
function handleDialogflowWebhook(req, res) {
    const city = req.body.queryResult.parameters['location']; // ดึงชื่อเมืองจากพารามิเตอร์

    // ใช้ moment-timezone ในการดึงเวลาจริงตามเมืองที่ระบุ
    const currentTime = moment().tz(city).format('HH:mm');

    let responseText = `เวลาปัจจุบันใน ${city} คือ ${currentTime}.`;

    return res.json({
        fulfillmentText: responseText,  // ส่งเวลาจริงกลับไปที่ Dialogflow
    });
}

// ส่งข้อความตอบกลับไปที่ Line
function replyMessage(replyToken, message) {
    const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message/reply';

    request.post({
        url: LINE_MESSAGING_API,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}` // ใส่ Access Token ของคุณ
        },
        body: JSON.stringify({
            replyToken: replyToken,
            messages: [
                {
                    type: 'text',
                    text: message
                }
            ]
        })
    }, (error, response, body) => {
        if (error) {
            console.error('Error sending message:', error);
        } else {
            console.log('Message sent:', body);
        }
    });
}

module.exports = {
    handleWebhook,
    handleDialogflowWebhook
};
