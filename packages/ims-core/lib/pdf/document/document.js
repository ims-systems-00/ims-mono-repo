const PdfKit = require("pdfkit");
class PDFDocument extends PdfKit {
  constructor(...args) {
    super(...args);
  }
  jumpLine(lines) {
    for (let index = 0; index < lines; index++) {
      this.moveDown();
    }
    return this;
  }
}
module.exports = PDFDocument;
