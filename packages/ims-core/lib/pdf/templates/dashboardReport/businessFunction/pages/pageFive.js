const PdfHelper = require("../../../../helper");
const { fresh, sectionHeader } = require("../../../../themes/fresh");
const { fontColors } = require("../../../../variables/font");
const { ofisByStatus, auditIndentifications } = require("../charts");
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
  let ofisByStatusChart = await ofisByStatus(data);
  doc.image(ofisByStatusChart, 60, 120, {
    fit: [doc.page.width - 120, 400],
    align: "center",
  });
  pdfHelper.jumpLine(20);
  dox = sectionHeader(doc, "Audits overview");
  let auditIndentificationsChart = await auditIndentifications(data);
  doc.image(auditIndentificationsChart, 60, 500, {
    fit: [doc.page.width - 120, 400],
    align: "center",
  });
  const balance = 60;
  const _incidentCountStartX = doc.x;
  const _incidentCountStartY = doc.y;
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf")
    .fontSize(14)
    .fill(fontColors.blue);

  doc.text(
    `Total scheduled : ${data.audits.inCompleted}`,
    _incidentCountStartX,
    _incidentCountStartY,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.text(
    `Total audited : ${data.audits.completed}`,
    _incidentCountStartX + doc.page.width / 2 - balance,
    _incidentCountStartY,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.x = _incidentCountStartX;
  doc = fresh(doc);
  return doc;
}
module.exports = { pageFive };
