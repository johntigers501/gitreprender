const express = require('express');
const bodyParser = require('body-parser');
const server = require('./server'); // เรียกใช้ไฟล์ server.js
const dialogflow = require('./dialogflow'); // เรียกใช้ไฟล์ dialogflow.js
const fs = require('fs'); // ใช้ fs สำหรับบันทึกการสนทนา

const app = express();
app.use(bodyParser.json());

// ฟังก์ชันบันทึกการสนทนา
function logConversation(userId, message) {
    const logEntry = `User: ${userId}, Message: ${message}\n`;
    fs.appendFile('conversation_log.txt', logEntry, err => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

// ตั้งค่า endpoint สำหรับ webhook ของ LINE Bot
app.post('/line-webhook', (req, res) => {
    const events = req.body.events;

    events.forEach(event => {
        if (event.type === 'message' && event.message.type === 'text') {
            const userMessage = event.message.text;
            const userId = event.source.userId;

            console.log(`Received message from ${userId}: ${userMessage}`); // แสดงข้อความใน console
            logConversation(userId, userMessage); // บันทึกการสนทนา

            // ฟังก์ชันส่งข้อความตอบกลับ (ให้ปรับไปตามการใช้งานของคุณ)
            server.replyToUser(userId, userMessage);
        }
    });

    res.sendStatus(200);
});

// ตั้งค่า endpoint สำหรับ webhook ของ Dialogflow
app.post('/dialogflow-webhook', dialogflow.handleDialogflowWebhook);

// เริ่มต้นเซิร์ฟเวอร์
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // เรียกใช้ฟังก์ชันส่งข้อความต้อนรับเมื่อเซิร์ฟเวอร์เริ่มต้นทำงาน
    server.sendWelcomeBroadcast();
});
