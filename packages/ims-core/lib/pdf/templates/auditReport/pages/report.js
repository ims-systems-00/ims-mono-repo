const PdfHelper = require("../../../helper");
const { fresh, sectionHeader } = require("../../../themes/fresh");
const { cip } = require("./cip");
const { identification } = require("./identification");
const { risk } = require("./risk");
const moment = require("moment");
const { colors } = require("../../../variables/colors");
const staticAssetPath = __dirname + "/../../../../../assets";

/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 * @returns {import('pdfkit')} - this returns a pdf kit document object.
 */
async function report(doc, data) {
  if (!doc) throw new Error("Document is required to draw.");
  let pdfHelper = new PdfHelper(doc);
  fresh(doc);
  doc.addPage({});
  dox = sectionHeader(doc, "Audit information");
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-medium.otf")
    .fontSize(14);
  doc.text(`Title : ${data?.title} `, {
    align: "left",
    lineGap: 10,
  });
  doc.text(`Reference : ${data?.reference}`, {
    align: "left",
    lineGap: 10,
  });
  const balance = 60;
  const _infoStartX = doc.x;
  const _infoStartY = doc.y;
  doc.text(`Business unit: ${data?.group?.name}`, {
    align: "left",
    lineGap: 10,
  });
  doc.text(`Complaince body : ${data?.complianceBody?.name}`, {
    align: "left",
    lineGap: 10,
  });
  doc.text(`Auditor : ${data?.auditor?.name}`, {
    align: "left",
    lineGap: 10,
  });
  doc.text(`Focus area : ${data?.focusArea}`, {
    align: "left",
    lineGap: 10,
  });
  pdfHelper.jumpLine(2);
  dox = sectionHeader(doc, "Audit schedule");
  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-medium.otf")
    .fontSize(14);
  doc.text(
    `Schedule date : ${moment(data?.startDate).format("DD/MM/YYYY h:m a")}`,
    {
      align: "left",
      lineGap: 10,
    }
  );
  doc.text(`Schedule by : ${data?.created?.by?.name}`, {
    align: "left",
    lineGap: 10,
  });
  doc.text(`Interval : ${data?.interval}`, {
    align: "left",
    lineGap: 10,
  });
  pdfHelper.jumpLine(2);
  doc.text(`Findings`, {
    align: "center",
    lineGap: 10,
  });
  doc
    .strokeColor(colors.gray_200)
    .moveTo(doc.x, doc.y)
    .lineTo(doc.x + doc.page.width - 2 * doc.page.margins.right, doc.y)
    .stroke();
  pdfHelper.jumpLine(2);
  dox = sectionHeader(doc, "Non conformities and root causes");
  if (data.identifications.length) {
    for (let _identification of data.identifications) {
      pdfHelper.jumpLine(1);
      identification(doc, _identification);
    }
  } else {
    doc.text(`No data is avaiable.`, {
      align: "center",
      lineGap: 10,
    });
  }
  pdfHelper.jumpLine(2);
  dox = sectionHeader(doc, "Risks identified");
  if (data.risks.length) {
    for (let _risk of data.risks) {
      pdfHelper.jumpLine(1);
      doc = risk(doc, _risk);
    }
  } else {
    doc.text(`No data is avaiable.`, {
      align: "center",
      lineGap: 10,
    });
  }

  pdfHelper.jumpLine(2);
  dox = sectionHeader(doc, "OFIs identified");

  if (data.cips.length) {
    for (let _cip of data.cips) {
      pdfHelper.jumpLine(1);
      cip(doc, _cip);
    }
  } else {
    doc.text(`No data is avaiable.`, {
      align: "center",
      lineGap: 10,
    });
  }
  pdfHelper.jumpLine(2);
  doc = sectionHeader(doc, "Audit summary");

  doc
    .font(staticAssetPath + "/fonts/metropolis/metropolis-medium.otf")
    .fontSize(14);
  doc.text(`${data?.comment}`, {
    align: "left",
    lineGap: 10,
  });
  pdfHelper.jumpLine(2);
  if (data.completed.status) {
    doc
      .strokeColor(colors.gray_200)
      .moveTo(doc.x, doc.y)
      .lineTo(doc.x + doc.page.width - 2 * doc.page.margins.right, doc.y)
      .stroke();
    pdfHelper.jumpLine(1);
    doc
      .font(staticAssetPath + "/fonts/metropolis/metropolis-medium.otf")
      .fontSize(10);
    doc.text(
      `This audit was completed on ${moment(data?.completed.on).format(
        "DD/MM/YYYY HH:MM"
      )} by ${data?.completed.by.name}`,
      {
        align: "center",
        lineGap: 10,
      }
    );
  }
  return doc;
}
module.exports = { report };
