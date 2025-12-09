const { coverPage } = require("../../themes/fresh");
const { report } = require("./pages");
/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @param {Object} options - this is the options object to control  vairous datasets and params
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function auditReport(doc, options) {
  if (!doc) throw new Error("Document is required to draw.");
  doc = coverPage(doc, {
    ...options?.metaInfo,
  });
  doc = await report(doc, options?.data);
  return doc;
}
module.exports = { auditReport };
