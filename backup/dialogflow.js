const moment = require('moment-timezone');

// �ѧ��ѹ����Ѻ�Ѵ��� Webhook ����Ѻ Dialogflow
function handleDialogflowWebhook(req, res) {
    const city = req.body.queryResult.parameters['location']; // �֧�������ͧ�ҡ����������

    // �� moment-timezone 㹡�ô֧���Ҩ�ԧ������ͧ����к�
    const currentTime = moment().tz(city).format('HH:mm');

    let responseText = `���һѨ�غѹ� ${city} ��� ${currentTime}.`;

    return res.json({
        fulfillmentText: responseText,  // �����Ҩ�ԧ��Ѻ价�� Dialogflow
    });
}

module.exports = {
    handleDialogflowWebhook
};
