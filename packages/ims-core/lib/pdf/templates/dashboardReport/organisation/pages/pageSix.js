const PdfHelper = require("../../../../helper");
const { fresh, sectionHeader } = require("../../../../themes/fresh");
const { nonConformitiesByBusinessUnit } = require("../charts");
const staticAssetPath = __dirname + "/../../../../../../assets";

/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function pageSix(doc, data) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  doc.addPage({ size: "A4" });
  dox = sectionHeader(doc, "Audit Overview");
  const _auditsCountStartX = doc.x;
  const _auditsCountStartY = doc.y;
  const balance = 50;
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf")
    .fontSize(14);

  doc.text(
    `Total scheduled : ${data.audits.inCompleted}`,
    _auditsCountStartX,
    _auditsCountStartY,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.text(
    `Total completed : ${data.audits.completed}`,
    _auditsCountStartX + doc.page.width / 2 - balance,
    _auditsCountStartY,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.x = _auditsCountStartX
  pdfHelper.jumpLine(2)
  dox = sectionHeader(doc, "Top business units with most non conformities");
  doc.font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf").list(
    data.nonConformities.businessFunctionNames.map(
      (name, index) => `${name} : ${data.nonConformities.amount[index]}`
    ),
    {
      align: "left",
      lineGap: 10,
      listType: "bullet",
      bulletRadius: 3,
    }
  );
  let nonConformitiesByBusinessUnitChart = await nonConformitiesByBusinessUnit(
    data
  );
  doc.image(nonConformitiesByBusinessUnitChart, 60, 450, {
    fit: [doc.page.width - 120, 400],
    align: "center",
  });
  doc = fresh(doc);
  return doc;
}
module.exports = { pageSix };
