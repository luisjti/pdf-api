// server.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pdfRoutes = require('./routes/pdf');

const port = 5000;

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

app.use(express.json()); // This line is crucial
app.use(pdfRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
