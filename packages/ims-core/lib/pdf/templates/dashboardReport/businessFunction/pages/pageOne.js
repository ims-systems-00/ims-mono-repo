const PdfHelper = require("../../../../helper");
const { fresh, sectionHeader } = require("../../../../themes/fresh");
const { digitalMaturityMatrix } = require("../charts");
const staticAssetPath = __dirname + "/../../../../../../assets";

/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function pageOne(doc, data) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  doc.addPage({ size: "A4" });
  dox = sectionHeader(doc, "Integrated management system");
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf")
    .list(
      [
        `Business Unit : ${data.groupName}`,
        `Number of Staff : ${data.numberOfStaffs}`,
        `Remote Staff : ${data.staffRemote}`,
        `Organisational State : ${data.organizationalState}`,
        `Critical Area : ${data.criticalArea}`,
        `Organisational Confidence : ${data.organizationalConfidence}%`,
      ],
      {
        align: "left",
        lineGap: 10,
        listType: "bullet",
        bulletRadius: 3,
      }
    );
  pdfHelper.jumpLine(3);
  dox = sectionHeader(doc, "Digital maturity matrix");
  let digitalMaturityMatrixChart = await digitalMaturityMatrix(data);
  doc.image(digitalMaturityMatrixChart, 60, 350, {
    fit: [doc.page.width - 120, 400],
    align: "center",
  });
  doc = fresh(doc);
  return doc;
}
module.exports = { pageOne };
