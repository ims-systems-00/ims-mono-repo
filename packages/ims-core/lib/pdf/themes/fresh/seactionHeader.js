const PdfHelper = require("../../helper");
const { fontColors } = require("../../variables/font");
const staticAssetPath = __dirname + "/../../../../assets";
/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
function sectionHeader(doc, header) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-bold.otf")
    .fontSize(15)
    .fill(fontColors.blue)
    .text(header, {
      align: "left",
      lineGap: 3,
    });
  doc.image(staticAssetPath + "/images/report-underline.png", doc.x, doc.y, {
    fit: [50, 5],
    align: "left",
  });
  pdfHelper.jumpLine(1);
  return doc;
}
module.exports = { sectionHeader };
