const PdfHelper = require("../../../../helper");
const { fresh, sectionHeader } = require("../../../../themes/fresh");
const { supplierCompliance, supplierIncidents } = require("../charts");
const staticAssetPath = __dirname + "/../../../../../../assets";
const { dashBoard } = require("../charts/data");

/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function pageEight(doc, data) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  doc.addPage({ size: "A4" });
  doc = sectionHeader(doc, "Supplier overview");
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-bold.otf")
    .fontSize(14);
  doc.text(`Total contract value : £${data.supplier.contractValue.total}`, {
    align: "left",
    lineGap: 10,
  });
  pdfHelper.jumpLine(10);
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-bold.otf")
    .fontSize(14);
  doc.text(
    `Total suppliers ${
      data.supplierCompliance.compliant +
      data.supplierCompliance.inCompliant
    }`,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf")
    .fontSize(14);
  doc.text(
    `Compliance percentage : ${data.supplierCompliance.percentage}%`,
    {
      align: "left",
      lineGap: 10,
    }
  );
  let supplierComplianceChart = await supplierCompliance(data);
  doc.image(supplierComplianceChart, 0, 170, {
    fit: [doc.page.width - 50, 200],
    align: "right",
  });
  pdfHelper.jumpLine(16);
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-bold.otf")
    .fontSize(14);
  doc.text(`Open incidents : ${data.supplierIncidents.open}`, {
    align: "left",
    lineGap: 10,
  });
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf")
    .fontSize(14);
  doc.text(`Resolved incidents : ${data.supplierIncidents.resolved}`, {
    align: "left",
    lineGap: 10,
  });
  let supplierIncidentsChart = await supplierIncidents(data);
  doc.image(supplierIncidentsChart, 0, 450, {
    fit: [doc.page.width - 50, 200],
    align: "right",
  });
  doc = fresh(doc);
  return doc;
}
module.exports = { pageEight };
