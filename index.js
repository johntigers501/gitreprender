const express = require('express');
const bodyParser = require('body-parser');
const server = require('./server'); // ���¡����� server.js
const dialogflow = require('./dialogflow'); // ���¡����� dialogflow.js
const fs = require('fs'); // �� fs ����Ѻ�ѹ�֡���ʹ���

const app = express();
app.use(bodyParser.json());

// �ѧ��ѹ�ѹ�֡���ʹ���
function logConversation(userId, message) {
    const logEntry = `User: ${userId}, Message: ${message}\n`;
    fs.appendFile('conversation_log.txt', logEntry, err => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

// ��駤�� endpoint ����Ѻ webhook �ͧ LINE Bot
app.post('/line-webhook', (req, res) => {
    const events = req.body.events;

    events.forEach(event => {
        if (event.type === 'message' && event.message.type === 'text') {
            const userMessage = event.message.text;
            const userId = event.source.userId;

            console.log(`Received message from ${userId}: ${userMessage}`); // �ʴ���ͤ���� console
            logConversation(userId, userMessage); // �ѹ�֡���ʹ���

            // �ѧ��ѹ�觢�ͤ����ͺ��Ѻ (����Ѻ仵�������ҹ�ͧ�س)
            server.replyToUser(userId, userMessage);
        }
    });

    res.sendStatus(200);
});

// ��駤�� endpoint ����Ѻ webhook �ͧ Dialogflow
app.post('/dialogflow-webhook', dialogflow.handleDialogflowWebhook);

// ����������������
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // ���¡��ѧ��ѹ�觢�ͤ�����͹�Ѻ��������������������鹷ӧҹ
    server.sendWelcomeBroadcast();
});
