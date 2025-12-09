const PdfCreator = require('html-pdf')
const puppeteer = require('puppeteer')
const { logger } = require("@ims-systems-00/ims-core/lib/logger")
exports.pdfMaker = (document, options = {
    // orientation: "portrait",
    format: 'A4',
    border: "0",
}) => new Promise(async (resolve, reject) => {
    const DELTA = .27
    try {
        PdfCreator.create(document.html, options).toFile(document.path, function (err, res) {
            if (err) return reject(err)
            return resolve("Pdf created successfully")
        })
    } catch (err) {
        logger.info(err)
        reject(err)
    }
})
exports.puppeteerPdf = (document, options = {
    // orientation: "portrait",
    format: 'A4',
    border: "0",
}) => new Promise(async (resolve, reject) => {
    const DELTA = .27
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--hide-scrollbars',
                '--disable-web-securoty'
            ]
        });
        const page = await browser.newPage()
        await page.setContent(document.html)
        await page.pdf({
            path: document.path,
            displayHeaderFooter: false,
            margin: {
                top: '3cm',
                left: 0,
                right: 0,
                bottom: 0
            },
            scale: 2,
        })
        await browser.close();
        return resolve("Pdf created successfully")

    } catch (err) {
        logger.info(err)
        reject(err)
    }
})