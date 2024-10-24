const moment = require('moment-timezone');

// ฟังก์ชันสำหรับจัดการ Webhook สำหรับ Dialogflow
function handleDialogflowWebhook(req, res) {
    const date = req.body.queryResult.parameters['date']; // ดึงค่าพารามิเตอร์ date
    let responseText;

    // คำนวณค่า quantity ตามวันที่ที่ได้รับ
    const nowQuantity = calculateQuantity(date); // สมมุติว่ามีฟังก์ชันคำนวณจำนวน

    // สร้างข้อความตอบกลับ
    if (date) {
        responseText = `รอบของวันที่ ${date} คือ ${nowQuantity} บาท`;
    } else {
        responseText = "ไม่พบข้อมูลสำหรับรอบที่ระบุ";
    }

    // ส่งข้อความตอบกลับไปที่ Dialogflow
    return res.json({
        fulfillmentText: responseText,
    });
}

// ฟังก์ชันคำนวณ quantity
function calculateQuantity(date) {
    // เพิ่ม logic ที่นี่เพื่อตรวจสอบและคำนวณจำนวนตามวัน
    // นี่คือตัวอย่างง่ายๆ สำหรับการคำนวณ
    const quantity = date * 10; // ตัวอย่างการคำนวณ
    return quantity;
}

module.exports = {
    handleDialogflowWebhook
};
