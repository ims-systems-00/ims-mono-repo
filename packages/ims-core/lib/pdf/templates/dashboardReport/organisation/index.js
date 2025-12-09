const { coverPage } = require("../../../themes/fresh");
const {
  pageOne,
  pageThree,
  pageTwo,
  pageFour,
  pageFive,
  pageSix,
  pageSeven,
  pageEight,
  pageNine,
  pageTen,
} = require("./pages");
/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @param {Object} options - this is the options object to control  vairous datasets and params
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function dashboardReport(doc, options) {
  if (!doc) throw new Error("Document is required to draw.");
  doc = coverPage(doc, {
    ...options?.metaInfo,
  });
  doc = await pageOne(doc, options?.data);
  doc = await pageTwo(doc, options?.data);
  doc = await pageThree(doc, options?.data);
  doc = await pageFour(doc, options?.data);
  doc = await pageFive(doc, options?.data);
  doc = await pageSix(doc, options?.data);
  doc = await pageSeven(doc, options?.data);
  doc = await pageEight(doc, options?.data);
  doc = await pageNine(doc, options?.data);
  doc = await pageTen(doc, options?.data);
  return doc;
}
module.exports = { dashboardReport };
