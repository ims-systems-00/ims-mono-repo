const PdfHelper = require("../../../../helper");
const { fresh } = require("../../../../themes/fresh");
const { sectionHeader } = require("../../../../themes/fresh/seactionHeader");
const { fontColors } = require("../../../../variables/font");
const {
  numberOfCustomers,
  contractValues,
  numberInvoicesThisMonth,
  invoiceValuesThisMonth,
} = require("../charts");
const { dashBoard } = require("../charts/data");
const staticAssetPath = __dirname + "/../../../../../../assets";

/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function pageNine(doc, data) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  doc.addPage({ size: "A4" });
  doc = sectionHeader(doc, "CRM Overview");
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-medium.otf")
    .fontSize(14)
    .fill(fontColors.blue)
    .text("Live customers", {
      align: "center",
      lineGap: 10,
    });
  const _crmOverviewStartX = doc.x;
  const _crmOverviewStartY = doc.y;
  const balance = 60;
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-light.otf")
    .fontSize(13)
    .fill(fontColors.blue);
  doc.text(
    `Total contract value : £${parseInt(data.crm.totalLiveContractValue)}`,
    _crmOverviewStartX,
    _crmOverviewStartY,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.text(
    `Highest contract value : £${parseInt(
      data.crm.mostValuedLiveCustomer.value
    )}`,
    _crmOverviewStartX + doc.page.width / 2 - balance,
    _crmOverviewStartY,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.text(
    `Average contract value : £${parseInt(data.crm.averageContractValue)}`,
    _crmOverviewStartX,
    _crmOverviewStartY + 30,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.text(
    `Lowest contract value : £${parseInt(
      data.crm.lessValuedLiveCustomer.value
    )}`,
    _crmOverviewStartX + doc.page.width / 2 - balance,
    _crmOverviewStartY + 30,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.x = _crmOverviewStartX;
  pdfHelper.jumpLine(1);
  dox = sectionHeader(doc, "Analytics by status");
  let numberOfCustomersChart = await numberOfCustomers(data);
  doc.image(numberOfCustomersChart, 60, 250, {
    fit: [240, 200],
    align: "center",
  });
  let contractValuesChart = await contractValues(data);
  doc.image(contractValuesChart, 320, 250, {
    fit: [240, 200],
    align: "center",
  });
  let numberInvoicesThisMonthChart = await numberInvoicesThisMonth(data);
  doc.image(numberInvoicesThisMonthChart, 60, 450, {
    fit: [240, 200],
    align: "center",
  });
  let invoiceValuesThisMonthChart = await invoiceValuesThisMonth(data);
  doc.image(invoiceValuesThisMonthChart, 320, 450, {
    fit: [240, 200],
    align: "center",
  });
  doc = fresh(doc);
  return doc;
}
module.exports = { pageNine };
