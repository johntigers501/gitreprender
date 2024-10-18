const line = require('@line/bot-sdk');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};
const client = new line.Client(config);

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

        } else if (event.type === 'leave') {
            console.log(`Bot left group: ${event.source.groupId}`);

        } else if (event.type === 'message' && event.message.type === 'text') {
            const replyToken = event.replyToken;
            const message = event.message.text;
            const sourceType = event.source.type; // user ���� group
            const userId = event.source.userId;

            if (sourceType === 'user') {
                client.getProfile(userId)
                    .then((profile) => {
                        const userName = profile.displayName;
                        const replyMessage = {
                            type: 'text',
                            text: `You said: ${message}\n�ҡ: ${userName}`
                        };
                        return client.replyMessage(replyToken, replyMessage);
                    })
                    .then(() => {
                        console.log('Message replied in 1:1 chat');
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } else if (sourceType === 'group') {
                const groupId = event.source.groupId;
                client.getProfile(userId)
                    .then((profile) => {
                        const userName = profile.displayName;
                        const replyMessage = {
                            type: 'text',
                            text: `You said: ${message}\n�ҡ: ${userName} 㹡����: ${groupId}`
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
        }
    });

    res.status(200).end();
}

module.exports = {
    handleWebhook
};
