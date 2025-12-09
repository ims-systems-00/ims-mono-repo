const PdfHelper = require("../../../../helper");
const { fresh, sectionHeader } = require("../../../../themes/fresh");
const { riskByStatus, assets } = require("../charts");
const staticAssetPath = __dirname + "/../../../../../../assets";

/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function pageThree(doc, data) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  doc.addPage({ size: "A4" });
  dox = sectionHeader(doc, "Risk data based on their status");
  let riskByStatusChart = await riskByStatus(data);
  doc.image(riskByStatusChart, 60, 120, {
    fit: [doc.page.width - 120, 400],
    align: "center",
  });
  pdfHelper.jumpLine(20);
  dox = sectionHeader(doc, "Inventory overview");
  let assetsChart = await assets(data);
  doc.image(assetsChart, 60, 450, {
    fit: [doc.page.width - 120, 400],
    align: "center",
  });
  doc = fresh(doc);
  return doc;
}
module.exports = { pageThree };
