// server.js

const express = require('express');
const app = express();
const pdfRoutes = require('./routes/pdf');

const port = 5000;

app.use(express.json()); // This line is crucial
app.use(pdfRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
