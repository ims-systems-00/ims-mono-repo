const PDFDocument = require("pdfkit");
const fs = require("fs");
const templates = {
  ...require("./templates/dashboardReport/organisation"),
  ...require('./templates/dashboardReport/businessFunction'),
  ...require('./templates/auditReport'),
};
function build(
  options = {
    data: {},
    fileName: "output.pdf",
    template: "dashboardReport",
  }
) {
  return new Promise(async (resolve, reject) => {
    /**
     * following stepFinished function tracks the all the steps required to finish to
     * mark the whole write process as completed
     * here the steps are
     * - write stream needs to be ended
     * - pdf document needs to be closed by doc.end() method
     */
    let pendingSteps = 2;
    const stepFinished = () => {
      if (--pendingSteps === 0)
        return resolve("Pdf document has been prepared successfuly");
    };
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(`temp/${options?.fileName}`);
    doc.pipe(writeStream);
    writeStream.on("close", stepFinished);
    writeStream.on("error", (error) => reject(error));
    await templates[options?.template]?.(doc, options);
    doc.end();
    stepFinished();
  });
}
module.exports = {
  build,
};
