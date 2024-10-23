const express = require('express');
const bodyParser = require('body-parser');
const server = require('./server'); // Importing server.js

const app = express();
app.use(bodyParser.json());

// Set up endpoint for LINE Bot webhook
app.post('/line-webhook', server.handleWebhook); // Ensure this matches the exported name

// Set up endpoint for Dialogflow webhook
app.post('/dialogflow-webhook', server.handleDialogflowWebhook); // Ensure this matches the exported name

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
