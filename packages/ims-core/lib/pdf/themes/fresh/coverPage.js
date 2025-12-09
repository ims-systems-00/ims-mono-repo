const { fresh } = require("./fresh");
const PdfHelper = require("../../helper");
const { fontColors } = require("../../variables/font");
const moment = require("moment");
const staticAssetPath = __dirname + "/../../../../assets";
/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
function coverPage(doc, data) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  // fresh(doc);
  doc.image(staticAssetPath + "//images/report-cover-top.png", 0, 0, {
    fit: [pageWidth, pageHeight],
  });
  const logoMaxWidth = 120;
  const logoMaxHeight = 60;
  doc.image(
    staticAssetPath + "//images/ims-systems-logo-horizontal.png",
    430,
    290,
    {
      fit: [logoMaxWidth, logoMaxHeight],
    }
  );
  doc
    .font(staticAssetPath + "//fonts/metropolis/metropolis-light.otf")
    .fontSize(14)
    .fill(fontColors.green)
    .text(
      "FUTURE OF BUSINESS OPERATIONS",
      {
        align: "right",
      },
      pageHeight / 2 - 20,
      500
    );
  pdfHelper.jumpLine(5);
  doc
    .font(staticAssetPath + "//fonts/metropolis/metropolis-bold.otf")
    .fontSize(15)
    .fill(fontColors.blue)
    .text(data?.organisationName, {
      align: "left",
      lineGap: 10,
    });
  doc
    .font(staticAssetPath + "//fonts/metropolis/metropolis-light.otf")
    .fontSize(14)
    .fill(fontColors.green)
    .text(data.reportTitle, {
      align: "left",
      lineGap: 10,
    });
  doc.image(
    staticAssetPath + "//images/report-underline.png",
    doc.page.margins.left,
    510,
    {
      fit: [40, 30],
    }
  );
  pdfHelper.jumpLine(3);
  const balance = 50;
  const _peopleInfoStartX = doc.x;
  const _peopleInfoStartStartY = doc.y;
  doc
    .font(staticAssetPath + "//fonts/metropolis/metropolis-light.otf")
    .fontSize(12)
    .fill(fontColors.blue)
    .text("SENT BY", {
      align: "left",
      lineGap: 10,
    });
  doc
    .font(staticAssetPath + "//fonts/metropolis/metropolis-medium.otf")
    .fontSize(14)
    .fill(fontColors.blue)
    .text(data?.sentBy?.name, {
      align: "left",
      lineGap: 10,
    });
  doc
    .font(staticAssetPath + "//fonts/metropolis/metropolis-medium.otf")
    .fontSize(13)
    .fill(fontColors.blue)
    .text(data?.sentBy?.email, {
      align: "left",
      lineGap: 15,
    });
  doc
    .font(staticAssetPath + "//fonts/metropolis/metropolis-light.otf")
    .fontSize(12)
    .fill(fontColors.blue)
    .text(`DATE ${data.sentOn}`, {
      align: "left",
    });
  doc
    .font(staticAssetPath + "//fonts/metropolis/metropolis-light.otf")
    .fontSize(12)
    .fill(fontColors.blue)
    .text(
      "SENT TO",
      _peopleInfoStartX + doc.page.width / 2 - balance,
      _peopleInfoStartStartY,
      {
        lineGap: 10,
      }
    );
  doc
    .font(staticAssetPath + "//fonts/metropolis/metropolis-medium.otf")
    .fontSize(14)
    .fill(fontColors.blue)
    .text(data?.sentTo?.name, {
      lineGap: 10,
    });
  doc
    .font(staticAssetPath + "//fonts/metropolis/metropolis-medium.otf")
    .fontSize(13)
    .fill(fontColors.blue)
    .text(data?.sentTo?.email, {
      align: "left",
      lineGap: 15,
    });
  return doc;
}
module.exports = { coverPage };
