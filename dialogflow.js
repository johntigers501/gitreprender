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
    // ตรวจสอบว่าค่าของ date ที่รับมามีรูปแบบที่ถูกต้อง
    const parsedDate = moment(date, 'YYYY-MM-DD');

    if (!parsedDate.isValid()) {
        return "ไม่พบข้อมูลวันที่ที่ถูกต้อง";
    }

    // ตัวอย่างการคำนวณ quantity จากวันที่ (เช่นเอาวันที่หารเพื่อดูจำนวน)
    const quantity = parsedDate.date() * 10; // ใช้วันที่ (day of month) ในการคำนวณ
    return quantity;
}


module.exports = {
    handleDialogflowWebhook
};
