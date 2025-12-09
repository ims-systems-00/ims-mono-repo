const { fontColors } = require("../../variables/font");
const staticAssetPath = __dirname + "/../../../../assets";
/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 */
function drawTheme(doc) {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const logoMaxWidth = 80;
  const logoMaxHeight = 30;
  doc.image(
    staticAssetPath + "//images/ims-systems-logo-horizontal.png",
    450,
    doc.page.margins.top - 20,
    {
      fit: [logoMaxWidth, logoMaxHeight],
    }
  );
  const footerAspectRatio = 4.68;
  doc.image(
    staticAssetPath + "//images/report-footer-vector.png",
    0,
    pageHeight - pageWidth / footerAspectRatio,
    {
      fit: [pageWidth, pageHeight],
    }
  );
  let margins = { ...doc.page.margins };
  doc.page.margins.bottom = 0;
  doc
    .font(staticAssetPath + "//fonts/metropolis/metropolis-light.otf")
    .fontSize(12)
    .fill(fontColors.white)
    .text(
      "www.imssystems.tech",
      {
        link: "https://imssystems.tech",
        align: "right",
      },
      pageHeight - 40,
      500
    );
  /**
   * restrore previous condition
   */
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-medium.otf")
    .fontSize(14)
    .fill(fontColors.blue);
  doc.x = doc.page.margins.left;
  doc.y = doc.page.margins.top;
  doc.page.margins.bottom = 150;
}
/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
function fresh(doc) {
  if (!doc) throw new Error("Document is required to draw.");
  doc.on("pageAdded", () => {
    drawTheme(doc);
  });
  drawTheme(doc);
  return doc;
}
module.exports = { fresh };
