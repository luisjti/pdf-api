const express = require('express');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const router = express.Router();
const fs = require('fs').promises; // Note the use of .promises

router.post('/generate-pdf', async (req, res) => {
    try {
        // The entire request body is passed to the template, allowing for dynamic data usage
        const data = req.body.data;
        const templateName = req.body.template

        const templateHtml = await fs.readFile(`./templates/${templateName}.html`, 'utf8');
    
        const template = handlebars.compile(templateHtml);
        const html = template(data);
        
        // Use Puppeteer to generate a PDF from the HTML
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        // Send the generated PDF as a response
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Failed to generate PDF:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
