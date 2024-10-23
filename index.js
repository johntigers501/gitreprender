const express = require('express');
const bodyParser = require('body-parser');
const server = require('./server'); // ���¡����� server.js

const app = express();
app.use(bodyParser.json());

// ��駤�� endpoint ����Ѻ webhook �ͧ Line Bot
app.post('/line-webhook', server.handleWebhook);

// ��駤�� endpoint ����Ѻ webhook �ͧ Dialogflow
app.post('/dialogflow-webhook', server.handleDialogflowWebhook);

// ����������������
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // ���¡��ѧ��ѹ�觢�ͤ�����͹�Ѻ������ѹ�������������
    server.sendWelcomeBroadcast();
});
