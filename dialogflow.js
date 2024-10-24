const moment = require('moment-timezone');

// ฟังก์ชันสำหรับจัดการ Webhook สำหรับ Dialogflow
function handleDialogflowWebhook(req, res) {
    // ดึงชื่อเมืองจากพารามิเตอร์ location ที่ผู้ใช้ส่งเข้ามา
    const city = req.body.queryResult.parameters['location'];

    // ตรวจสอบและจัดการเวลา
    let currentTime;
    try {
        // ใช้ moment-timezone เพื่อดึงเวลาปัจจุบันตามเมืองที่ระบุ
        currentTime = moment().tz(city).format('HH:mm');
    } catch (e) {
        // หากมีข้อผิดพลาดหรือไม่พบ timezone ของเมืองนั้น
        return res.json({
            fulfillmentText: `ขอโทษครับ, ฉันไม่สามารถหาข้อมูลเวลาใน ${city} ได้. กรุณาตรวจสอบชื่อเมืองอีกครั้ง.`
        });
    }

    // สร้างข้อความตอบกลับ
    const responseText = `เวลาปัจจุบันใน ${city} คือ ${currentTime}.`;

    // ส่งข้อความตอบกลับไปที่ Dialogflow
    return res.json({
        fulfillmentText: responseText,
    });
}

module.exports = {
    handleDialogflowWebhook
};
