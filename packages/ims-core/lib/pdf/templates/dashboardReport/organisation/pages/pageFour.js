const PdfHelper = require("../../../../helper");
const { fontColors } = require("../../../../variables/font");
const { fresh, sectionHeader } = require("../../../../themes/fresh");
const { incidentsByBusinessUnit } = require("../charts");
const { dashBoard } = require("../charts/data");
const staticAssetPath = __dirname + "/../../../../../../assets";

/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function pageFour(doc, data) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  doc.addPage({ size: "A4" });
  dox = sectionHeader(doc, "Business units with the most incidents");
  let incidentsByBusinessUnitChart = await incidentsByBusinessUnit(data);
  doc.image(incidentsByBusinessUnitChart, 60, 120, {
    fit: [doc.page.width - 120, 400],
    align: "center",
  });
  pdfHelper.jumpLine(20);
  dox = sectionHeader(doc, "Incident overview");
  const balance = 60;
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-medium.otf")
    .fontSize(14)
    .fill(fontColors.blue)
    .text("Incident count", {
      align: "center",
      lineGap: 10,
    });
  const _incidentCountStartX = doc.x;
  const _incidentCountStartY = doc.y;
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf")
    .fontSize(14)
    .fill(fontColors.blue);

  doc.text(
    `Total raised : ${data.incidents.total}`,
    _incidentCountStartX,
    _incidentCountStartY,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.text(
    `Total resolved : ${data.incidents.resolved}`,
    _incidentCountStartX + doc.page.width / 2 - balance,
    _incidentCountStartY,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.x = _incidentCountStartX;
  pdfHelper.jumpLine(2);
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-medium.otf")
    .fontSize(14)
    .fill(fontColors.blue)
    .text(`Average resolution time`, {
      align: "center",
      lineGap: 10,
    });
  const _resolutionTimeStartX = doc.x;
  const _resolutionTimeStartY = doc.y;
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf")
    .fontSize(14)
    .fill(fontColors.blue);

  doc.text(
    `P1 resolution time : ${data.incidents.p1AvgResolutionTime.time}`,
    _resolutionTimeStartX,
    _resolutionTimeStartY,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.text(
    `P2 resolution time : ${data.incidents.p2AvgResolutionTime.time}`,
    _resolutionTimeStartX + doc.page.width / 2 - balance,
    _resolutionTimeStartY,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.text(
    `P3 resolution time : ${data.incidents.p3AvgResolutionTime.time}`,
    _resolutionTimeStartX,
    _resolutionTimeStartY + 30,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.text(
    `P4 resolution time : ${data.incidents.p4AvgResolutionTime.time}`,
    _resolutionTimeStartX + doc.page.width / 2 - balance,
    _resolutionTimeStartY + 30,
    {
      align: "left",
      lineGap: 10,
    }
  );

  doc = fresh(doc);
  return doc;
}
module.exports = { pageFour };
