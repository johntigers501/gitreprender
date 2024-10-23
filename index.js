const express = require('express');
const bodyParser = require('body-parser');
const server = require('./server'); // เรียกใช้ไฟล์ server.js

const app = express();
app.use(bodyParser.json());

// ตั้งค่า endpoint สำหรับ webhook ของ Line Bot
app.post('/line-webhook', server.handleWebhook);

// ตั้งค่า endpoint สำหรับ webhook ของ Dialogflow
app.post('/dialogflow-webhook', server.handleDialogflowWebhook);

// เริ่มต้นเซิร์ฟเวอร์
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // เรียกใช้ฟังก์ชันส่งข้อความต้อนรับเมื่อรันเซิร์ฟเวอร์เสร็จ
    server.sendWelcomeBroadcast();
});
