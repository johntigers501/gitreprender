const moment = require('moment-timezone');

// ฟังก์ชันสำหรับจัดการ Webhook สำหรับ Dialogflow
function handleDialogflowWebhook(req, res) {
    const city = req.body.queryResult.parameters['location']; // ดึงชื่อเมืองจากพารามิเตอร์

    // ใช้ moment-timezone ในการดึงเวลาจริงตามเมืองที่ระบุ
    const currentTime = moment().tz(city).format('HH:mm');

    let responseText = `เวลาปัจจุบันใน ${city} คือ ${currentTime}.`;

    return res.json({
        fulfillmentText: responseText,  // ส่งเวลาจริงกลับไปที่ Dialogflow
    });
}

module.exports = {
    handleDialogflowWebhook
};
