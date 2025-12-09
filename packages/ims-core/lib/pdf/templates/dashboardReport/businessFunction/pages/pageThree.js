const PdfHelper = require("../../../../helper");
const { fresh, sectionHeader } = require("../../../../themes/fresh");
const { fontColors } = require("../../../../variables/font");
const { finance, assets } = require("../charts");
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
  dox = sectionHeader(doc, "Risks Overview");
  const balance = 60;
  const _risksCountStartX = doc.x;
  const _risksCountStartY = doc.y;
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf")
    .fontSize(14)
    .fill(fontColors.blue);

  doc.text(
    `Total risks : ${data.risksOverview.totalRisksInThisSystemDates}`,
    _risksCountStartX,
    _risksCountStartY,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.x = _risksCountStartX;
  pdfHelper.jumpLine(2);
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-medium.otf")
    .fontSize(14)
    .fill(fontColors.blue)
    .text(`Total risks this month`, {
      lineGap: 10,
    });
  const _riskOverviewStartX = doc.x;
  const _riskOverviewStartY = doc.y;
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf")
    .fontSize(14)
    .fill(fontColors.blue);

  doc.text(
    `Open risks : ${data.risksOverview.totalOpenedRisksInThisMonth}`,
    _riskOverviewStartX,
    _riskOverviewStartY,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.text(
    `Mitigated risks : ${data.risksOverview.totalMitigatedRisksInThisMonth}`,
    _riskOverviewStartX + doc.page.width / 2 - balance,
    _riskOverviewStartY,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.text(
    `Escalated risks : ${data.risksOverview.totalEscalatedRisksInThisMonth}`,
    _riskOverviewStartX,
    _riskOverviewStartY + 30,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.text(
    `Accepted risks : ${data.risksOverview.totalAcceptedRisksInThisMonth}`,
    _riskOverviewStartX + doc.page.width / 2 - balance,
    _riskOverviewStartY + 30,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.x = _riskOverviewStartX;
  pdfHelper.jumpLine(5);
  dox = sectionHeader(doc, "Inventory overview");
  let assetsChart = await assets(data);
  doc.image(assetsChart, 60, 370, {
    fit: [doc.page.width - 120, 400],
    align: "center",
  });
  doc = fresh(doc);
  return doc;
}
module.exports = { pageThree };
