const PdfHelper = require("../../../../helper");
const { fresh, sectionHeader } = require("../../../../themes/fresh");
const { riskLast12Months, riskByBusinessUnit } = require("../charts");
const staticAssetPath = __dirname + "/../../../../../../assets";

/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function pageTwo(doc, data) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  doc.addPage({ size: "A4" });
  doc = sectionHeader(doc, "Risks raised over the past year");
  let riskLast12MonthsChart = await riskLast12Months(data);
  doc.image(riskLast12MonthsChart, 60, 120, {
    fit: [doc.page.width - 120, 400],
    align: "center",
  });
  pdfHelper.jumpLine(20);
  dox = sectionHeader(doc, "Business units with the most risks");
  let riskByBusinessUnitChart = await riskByBusinessUnit(data);
  doc.image(riskByBusinessUnitChart, 60, 450, {
    fit: [doc.page.width - 120, 400],
    align: "center",
  });
  doc = fresh(doc);
  return doc;
}
module.exports = { pageTwo };
