const express = require('express');
const bodyParser = require('body-parser');
<<<<<<< HEAD
const server = require('./server'); // เรียกใช้ไฟล์ server.js
=======
>>>>>>> a9ad4858847d9de8596f565f776867638bb0989f

const app = express();
app.use(bodyParser.json());

<<<<<<< HEAD
// ตั้งค่า endpoint สำหรับ webhook
app.post('/webhook', server.handleWebhook);

// เริ่มต้นเซิร์ฟเวอร์
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

=======
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
>>>>>>> a9ad4858847d9de8596f565f776867638bb0989f
