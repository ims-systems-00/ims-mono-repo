const PdfHelper = require("../../../../helper");
const { fresh, sectionHeader } = require("../../../../themes/fresh");
const {
  ofiRaisedByBusinessUnit,
  ofiImplementedByBusinessUnit,
} = require("../charts");
const staticAssetPath = __dirname + "/../../../../../../assets";

/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function pageFive(doc, data) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  doc.addPage({ size: "A4" });
  dox = sectionHeader(doc, "Business units with the most OFIs");
  let ofiRaisedByBusinessUnitChart = await ofiRaisedByBusinessUnit(data);
  doc.image(ofiRaisedByBusinessUnitChart, 60, 120, {
    fit: [doc.page.width - 120, 400],
    align: "center",
  });
  pdfHelper.jumpLine(20);
  dox = sectionHeader(doc, "Business units implementing the most improvements");
  let ofiImplementedByBusinessUnitChart = await ofiImplementedByBusinessUnit(data);
  doc.image(ofiImplementedByBusinessUnitChart, 60, 450, {
    fit: [doc.page.width - 120, 400],
    align: "center",
  });
  doc = fresh(doc);
  return doc;
}
module.exports = { pageFive };
