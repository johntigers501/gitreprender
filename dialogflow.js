const moment = require('moment-timezone');

// �ѧ��ѹ����Ѻ�Ѵ��� Webhook ����Ѻ Dialogflow
function handleDialogflowWebhook(req, res) {
    // �֧�������ͧ�ҡ���������� location ��������������
    const city = req.body.queryResult.parameters['location'];

    // ��Ǩ�ͺ��ШѴ�������
    let currentTime;
    try {
        // �� moment-timezone ���ʹ֧���һѨ�غѹ������ͧ����к�
        currentTime = moment().tz(city).format('HH:mm');
    } catch (e) {
        // �ҡ�բ�ͼԴ��Ҵ������辺 timezone �ͧ���ͧ���
        return res.json({
            fulfillmentText: `���ɤ�Ѻ, �ѹ�������ö�Ң���������� ${city} ��. ��سҵ�Ǩ�ͺ�������ͧ�ա����.`
        });
    }

    // ���ҧ��ͤ����ͺ��Ѻ
    const responseText = `���һѨ�غѹ� ${city} ��� ${currentTime}.`;

    // �觢�ͤ����ͺ��Ѻ价�� Dialogflow
    return res.json({
        fulfillmentText: responseText,
    });
}

module.exports = {
    handleDialogflowWebhook
};
