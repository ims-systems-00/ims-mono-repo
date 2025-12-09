const PdfHelper = require("../../../helper");
const { fresh, sectionHeader } = require("../../../themes/fresh");
const { colors } = require("../../../variables/colors");
const staticAssetPath = __dirname + "/../../../../../assets";

/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function identification(doc, data) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-medium.otf")
    .fontSize(14);
  doc.text(`Non conformity : ${data?.nonConformity}`, {
    align: "left",
    lineGap: 10,
  });
  doc.text(`Root cause : ${data?.rootCause}`, {
    align: "left",
    lineGap: 10,
  });
  doc
    .strokeColor(colors.gray_200)
    .moveTo(doc.x, doc.y)
    .lineTo(doc.x + doc.page.width - 2 * doc.page.margins.right, doc.y)
    .stroke();
  return doc;
}
module.exports = { identification };
