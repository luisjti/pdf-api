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
        const pdfBuffer = await page.pdf(
            { 
            format: 'A4', 
            margin: {
                top: "0mm",
                right: "0mm",
                bottom: "0mm",
                left: "0mm"
                }
            });
        await browser.close();

        const pdfPath = `./saved_pdfs/${templateName}-${Date.now()}.pdf`;

        // Salvar o PDF no sistema de arquivos
        await fs.writeFile(pdfPath, pdfBuffer);
        
        // Send the generated PDF as a response
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Failed to generate PDF:', error);
        res.status(500).send('Server error');
    }
});

router.get('/pdf-html', async (req, res) => {
    try {
        const pdf2html = require('pdf2html');
        const html = await pdf2html.html('./proposta.pdf');
        console.log(html)
        res.send('ok')
      
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
