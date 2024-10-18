const express = require('express');
const bodyParser = require('body-parser');
const server = require('./server'); // เรียกใช้ไฟล์ server.js

const app = express();
app.use(bodyParser.json());

// ตั้งค่า endpoint สำหรับ webhook
app.post('/webhook', server.handleWebhook);

// เริ่มต้นเซิร์ฟเวอร์
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
