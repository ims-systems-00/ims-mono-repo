const PdfHelper = require("../../../../helper");
const { fresh, sectionHeader } = require("../../../../themes/fresh");
const { getColoursByPercentage } = require("../../../../utility");
const { colors } = require("../../../../variables/colors");
const { complianceToolsMap } = require("../../common");
const staticAssetPath = __dirname + "/../../../../../../assets";
/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function pageNine(doc, data) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  doc.addPage({ size: "A4" });
  doc = sectionHeader(doc, "Compliance overview");
  let complianceList = Object.keys(data.compliance);
  for (let tool of complianceList) {
    if (data.compliance[tool]) {
      doc
        .font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf")
        .fontSize(14)
        .text(
          `${complianceToolsMap[tool]} total : ${data.compliance[tool] || 0}%`,
          {
            align: "left",
            lineGap: 10,
          }
        );
      const _contentXStart = doc.page.margins.right;
      const _contentXEnd = doc.page.width - doc.page.margins.right;
      const _offset = 0;
      const _barWidth = _contentXEnd - _contentXStart - _offset;
      const _currentWidth = Math.ceil(
        _barWidth * ((data.compliance[tool] || 0) / 100)
      );
      doc
        .moveTo(_contentXStart, doc.y)
        .lineTo(_contentXStart + _barWidth, doc.y)
        .lineWidth(5)
        .strokeColor(colors.gray)
        .stroke();
      doc
        .moveTo(_contentXStart, doc.y)
        .lineTo(_contentXStart + _currentWidth, doc.y)
        .lineWidth(5)
        .strokeColor(getColoursByPercentage(data.compliance[tool] || 0))
        .stroke();
      pdfHelper.jumpLine(1);
    }
  }
  doc = fresh(doc);
  return doc;
}
module.exports = { pageNine };
