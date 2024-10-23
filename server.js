const line = require('@line/bot-sdk');
const moment = require('moment-timezone');
require('dotenv').config();

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};
const client = new line.Client(config);

// �ѧ��ѹ�Ѵ��� Webhook ����Ѻ Line Bot
function handleWebhook(req, res) {
    const events = req.body.events;

    events.forEach((event) => {
        if (event.type === 'follow') {
            const userId = event.source.userId;
            const welcomeMessage = {
                type: 'text',
                text: '�Թ�յ�͹�Ѻ! �ͺ�س��������ѹ�����͹'
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
                text: '���ʴշء��! �ѹ���������������������!'
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

// �ѧ��ѹ����Ѻ�Ѵ��â�ͤ����ҡ�����
function handleUserMessage(replyToken, message, userId) {
    client.getProfile(userId)
        .then((profile) => {
            const userName = profile.displayName;
            const replyMessage = {
                type: 'text',
                text: `�س�ٴ���: ${message}\n�ҡ: ${userName}`
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

// �ѧ��ѹ����Ѻ�Ѵ��â�ͤ���㹡����
function handleGroupMessage(replyToken, message, userId, groupId) {
    client.getProfile(userId)
        .then((profile) => {
            const userName = profile.displayName;
            const replyMessage = {
                type: 'text',
                text: `�س�ٴ���: ${message}\n�ҡ: ${userName} 㹡����: ${groupId}`
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

// �ѧ��ѹ����Ѻ�Ѵ��� Webhook ����Ѻ Dialogflow
function handleDialogflowWebhook(req, res) {
    const city = req.body.queryResult.parameters['location']; // �֧�������ͧ�ҡ����������

    // �� moment-timezone 㹡�ô֧���Ҩ�ԧ������ͧ����к�
    const currentTime = moment().tz(city).format('HH:mm');

    let responseText = `���һѨ�غѹ� ${city} ��� ${currentTime}.`;

    return res.json({
        fulfillmentText: responseText,  // �����Ҩ�ԧ��Ѻ价�� Dialogflow
    });
}

// �觢�ͤ����ͺ��Ѻ价�� Line
function replyMessage(replyToken, message) {
    const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message/reply';

    request.post({
        url: LINE_MESSAGING_API,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}` // ��� Access Token �ͧ�س
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
