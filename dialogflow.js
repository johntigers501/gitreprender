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
    // ��Ǩ�ͺ��Ҥ�Ңͧ date ����Ѻ�����ٻẺ���١��ͧ
    const parsedDate = moment(date, 'YYYY-MM-DD');

    if (!parsedDate.isValid()) {
        return "��辺�������ѹ�����١��ͧ";
    }

    // ������ҧ��äӹǳ quantity �ҡ�ѹ��� (������ѹ���������ʹ٨ӹǹ)
    const quantity = parsedDate.date() * 10; // ���ѹ��� (day of month) 㹡�äӹǳ
    return quantity;
}


module.exports = {
    handleDialogflowWebhook
};
