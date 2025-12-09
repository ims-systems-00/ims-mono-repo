const moment = require("moment");
const PdfHelper = require("../../../../helper");
const { fresh, sectionHeader } = require("../../../../themes/fresh");
const staticAssetPath = __dirname + "/../../../../../../assets";
const { dashBoard } = require("../charts/data");

/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function pageSeven(doc, data) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  doc.addPage({ size: "A4" });
  dox = sectionHeader(doc, "Management review");
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf")
    .list(
      [
        `Last conducted on ${moment(data.lastManagementReviewDate).format(
          "DD/MM/YYYY"
        )}`,
        `Next scheduled on ${moment(data.nextManagementReviewDate).format(
          "DD/MM/YYYY"
        )}`,
      ],
      {
        align: "left",
        lineGap: 10,
        listType: "bullet",
        bulletRadius: 3,
      }
    );
  pdfHelper.jumpLine(5);
  dox = sectionHeader(doc, "KPI/Objectives");
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf")
    .list(data.kpiObjectives, {
      align: "left",
      lineGap: 10,
      listType: "bullet",
      bulletRadius: 3,
    });
  doc = fresh(doc);
  return doc;
}
module.exports = { pageSeven };
