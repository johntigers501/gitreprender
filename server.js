const express = require('express'); // หากใช้ Express
const line = require('@line/bot-sdk');
const { SessionsClient } = require('@google-cloud/dialogflow'); // นำเข้า Dialogflow client
const { GoogleAuth } = require('google-auth-library'); // เพิ่มการนำเข้า GoogleAuth

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

// สร้าง client สำหรับ LINE
const lineClient = new line.Client(config);
const projectId = 'dlfmessmnage-lg9r'; // ใส่ชื่อโปรเจ็กต์ที่คุณสร้างใน Google Cloud
const auth = new GoogleAuth({
    keyFilename: './dlfmessmnage-lg9r-e1196464a94a.json', // เส้นทางไปยังไฟล์ JSON
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
});
const sessionClient = new SessionsClient({
    keyFilename: './dlfmessmnage-lg9r-e1196464a94a.json' // สร้าง client ด้วย Service Account
});

const app = express();
const port = process.env.PORT || 3000;

// Middleware เพื่อรับข้อมูลจาก LINE webhook
app.use(line.middleware(config));
app.post('/webhook', handleWebhook);

// ฟังก์ชันจัดการ webhook
async function handleWebhook(req, res) {
    const events = req.body.events;

    for (const event of events) {
        if (event.type === 'follow') {
            const userId = event.source.userId;
            const welcomeMessage = {
                type: 'text',
                text: 'ยินดีต้อนรับ! ขอบคุณที่เพิ่มฉันเป็นเพื่อน'
            };
            await lineClient.replyMessage(event.replyToken, welcomeMessage);
            console.log('Sent welcome message to new friend');

        } else if (event.type === 'join') {
            const joinMessage = {
                type: 'text',
                text: 'สวัสดีทุกคน! ฉันได้เข้าร่วมกลุ่มนี้แล้ว!'
            };
            await lineClient.replyMessage(event.replyToken, joinMessage);
            console.log('Sent join message in group');

        } else if (event.type === 'leave') {
            console.log(`Bot left group: ${event.source.groupId}`);

        } else if (event.type === 'message' && event.message.type === 'text') {
            const replyToken = event.replyToken;
            const message = event.message.text;
            const sourceType = event.source.type; // user หรือ group
            const userId = event.source.userId;

            if (sourceType === 'user') {
                const profile = await lineClient.getProfile(userId);
                const userName = profile.displayName;

                const replyMessage = {
                    type: 'text',
                    text: `You said: ${message}\nจาก: ${userName}`
                };
                await lineClient.replyMessage(replyToken, replyMessage);
                console.log('Message replied in 1:1 chat');

            } else if (sourceType === 'group') {
                const groupId = event.source.groupId;
                const profile = await lineClient.getProfile(userId);
                const userName = profile.displayName;

                const replyMessage = {
                    type: 'text',
                    text: `You said: ${message}\nจาก: ${userName} ในกลุ่ม: ${groupId}`
                };
                await lineClient.replyMessage(replyToken, replyMessage);
                console.log('Message replied in group');
            }

            // การตอบกลับจาก Dialogflow
            const sessionPath = sessionClient.projectAgentSessionPath(projectId, userId); // ใช้ userId เป็น sessionId
            const request = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: message,
                        languageCode: 'th', // เปลี่ยนเป็นภาษาไทยหรือภาษาที่คุณต้องการ
                    },
                },
            };

            try {
                const responses = await sessionClient.detectIntent(request);
                const result = responses[0].queryResult;
                const replyMessageFromDialogflow = {
                    type: 'text',
                    text: result.fulfillmentText,
                };
                await lineClient.replyMessage(replyToken, replyMessageFromDialogflow);
                console.log('Message replied from Dialogflow');
            } catch (error) {
                console.error('Error detecting intent:', error);
            }
        }
    }

    res.status(200).end();
}

// ส่งออกฟังก์ชัน handleWebhook
module.exports = {
    handleWebhook
};
