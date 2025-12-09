const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const { writeFileSync, readFileSync } = require("fs");
const path = require("path");
const staticAssetPath = __dirname + "/../../assets";
const avaibaleFontNames = {
  "felix-titling": "/fonts/felix-titling/felix-titling.ttf",
  "dobkin-script": "/fonts/dobkin-script/dobkin-script.ttf",
  "pinyon-script": "/fonts/pinyon-script/pinyon-script-regular.ttf",
};
function getPageNumberThatWillBeSigned(number, total) {
  if (number > total) {
    return total - 1;
  }
  if (number < 1) {
    return 0;
  }
  return number - 1;
}
async function attachSignature(
  data = {
    filePath: "./temp/buDashboardReport.pdf",
    name: "Ms. Jane",
    signature: "Ms. Jane",
    signatureFont: "dobkin-script",
    jobTile: "Sr. Vice President of Engineering ",
    organisation: "iMS Systems",
    startX: 0.1,
    startY: 0.85,
    pageNumber: 0,
  }
) {
  try {
    const document = await PDFDocument.load(readFileSync(data.filePath));
    document.registerFontkit(fontkit);
    const courierBoldFont = await document.embedFont(StandardFonts.CourierBold);
    let signatureFontinBytes = readFileSync(
      path.join(staticAssetPath, avaibaleFontNames[data.signatureFont])
    );
    const signatureFont = await document.embedFont(
      signatureFontinBytes || StandardFonts.TimesRomanBoldItalic
    );
    const pageToBeSigned = document.getPage(
      getPageNumberThatWillBeSigned(data.pageNumber, document.getPageCount())
    );
    const signatureConfig = {
      signatureFont: signatureFont,
      font: courierBoldFont,
      startX: pageToBeSigned.getWidth() * (data.startX || 0.1),
      startY:
        pageToBeSigned.getHeight() -
        pageToBeSigned.getHeight() * (data.startY || 0.1),
      lineGap: 10,
      signatureFontSize: 15,
      fontSize: 12,
      currentPosX: 0,
      currentPosY: 0,
    };
    signatureConfig.currentPosX = signatureConfig.startX;
    signatureConfig.currentPosY = signatureConfig.startY;
    pageToBeSigned.moveTo(signatureConfig.startX, signatureConfig.startY);
    pageToBeSigned.drawText(new Date().toUTCString(), {
      font: signatureConfig.font,
      size: signatureConfig.fontSize,
    });
    signatureConfig.currentPosY -=
      signatureConfig.lineGap + signatureConfig.fontSize;
    pageToBeSigned.moveTo(
      signatureConfig.currentPosX,
      signatureConfig.currentPosY
    );

    pageToBeSigned.drawText(
      `${data.name} \n${data.jobTile}\n${data.organisation}`,
      {
        font: signatureConfig.font,
        size: signatureConfig.fontSize,
        lineHeight: 10,
      }
    );
    signatureConfig.currentPosY -=
      signatureConfig.lineGap + signatureConfig.fontSize + 24;
    pageToBeSigned.moveTo(
      signatureConfig.currentPosX,
      signatureConfig.currentPosY
    );
    pageToBeSigned.drawText(data.signature, {
      font: signatureConfig.signatureFont,
      size: signatureConfig.signatureFontSize,
      color: rgb(0, 0, 1),
    });
    signatureConfig.currentPosY -= signatureConfig.lineGap;
    pageToBeSigned.drawLine({
      start: { x: signatureConfig.currentPosX, y: signatureConfig.currentPosY },
      end: {
        x: signatureConfig.currentPosX + 200,
        y: signatureConfig.currentPosY,
      },
      thickness: 2,
    });
    signatureConfig.currentPosY -=
      signatureConfig.lineGap + signatureConfig.signatureFontSize / 2;
    pageToBeSigned.moveTo(
      signatureConfig.currentPosX,
      signatureConfig.currentPosY
    );
    pageToBeSigned.drawText("Signature", {
      font: signatureConfig.font,
      size: signatureConfig.fontSize,
      lineHeight: 10,
    });
    writeFileSync(data.filePath, await document.save());
  } catch (err) {
    console.log(err.message);
    console.log(err);
  }
}
module.exports = { attachSignature };
