const express = require('express');
const bodyParser = require('body-parser');
const server = require('./server'); // Import server.js

const app = express();
app.use(bodyParser.json()); // Parse JSON body

// Endpoint for LINE Bot webhook
app.post('/line-webhook', server.handleWebhook);

// Endpoint for Dialogflow webhook (if applicable)
app.post('/dialogflow-webhook', server.handleDialogflowWebhook);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
