const express = require('express');
const bodyParser = require('body-parser');
const server = require('./server'); // ���¡����� server.js

const app = express();
app.use(bodyParser.json());

// ��駤�� endpoint ����Ѻ webhook
app.post('/webhook', server.handleWebhook);

// ����������������
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
