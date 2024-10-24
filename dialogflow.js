const moment = require('moment-timezone');

// �ѧ��ѹ����Ѻ�Ѵ��� Webhook ����Ѻ Dialogflow
function handleDialogflowWebhook(req, res) {
    const date = req.body.queryResult.parameters['date']; // �֧��Ҿ��������� date
    let responseText;

    // �ӹǳ��� quantity ����ѹ��������Ѻ
    const nowQuantity = calculateQuantity(date); // ���ص�����տѧ��ѹ�ӹǳ�ӹǹ

    // ���ҧ��ͤ����ͺ��Ѻ
    if (date) {
        responseText = `�ͺ�ͧ�ѹ��� ${date} ��� ${nowQuantity} �ҷ`;
    } else {
        responseText = "��辺����������Ѻ�ͺ����к�";
    }

    // �觢�ͤ����ͺ��Ѻ价�� Dialogflow
    return res.json({
        fulfillmentText: responseText,
    });
}

// �ѧ��ѹ�ӹǳ quantity
function calculateQuantity(date) {
    // ���� logic ��������͵�Ǩ�ͺ��Фӹǳ�ӹǹ����ѹ
    // ����͵�����ҧ����� ����Ѻ��äӹǳ
    const quantity = date * 10; // ������ҧ��äӹǳ
    return quantity;
}

module.exports = {
    handleDialogflowWebhook
};
