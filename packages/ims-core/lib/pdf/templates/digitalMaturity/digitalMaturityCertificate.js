const PDFDocument = require('pdfkit');
const fs = require('fs');
const PdfHelper = require('./helper');
const fontColors = {
  green: "#008386",
  blue: "#00375B"
}
function build() {
  const doc = new PDFDocument();
  const pdfHelper = new PdfHelper(doc)
  doc.pipe(fs.createWriteStream('temp/output.pdf'));
  const bgMaxWidth = doc.page.width;
  const bgMaxHeight = doc.page.height;
  const bgOffSet = 25
  doc.image(
    './assets/images/digital-maturity-certificate-bg.png',
    0,
    0,
    {
      fit: [bgMaxWidth + bgOffSet, bgMaxHeight + bgOffSet],
    }
  );
  const badgeMaxWidth = 250;
  const badgeMaxHeight = 250;
  doc.image(
    './assets/images/optimised-badge.png',
    350,
    40,
    {
      fit: [badgeMaxWidth, badgeMaxHeight],
      align: 'center',
    }
  );
  pdfHelper.jumpLine(4)
  doc
    .font('./assets/fonts/felix-titling/felix-titling.ttf')
    .fontSize(50)
    .fill(fontColors.green)
    .text('Certificate', {
      lineGap: 10
    })
  doc
    .font('./assets/fonts/minion/minion-pro-medium.otf')
    .fontSize(20)
    .fill(fontColors.blue)
    .text('OF OPTIMISATION', {
      lineGap: 10
    })
  pdfHelper.jumpLine(3)
  doc
    .font('./assets/fonts/minion/minion-pro-medium.otf')
    .fontSize(14)
    .fill(fontColors.blue)
    .text('PROUDLY PRESENTED TO', {
      lineGap: 10,
      characterSpacing: 3
    })
  pdfHelper.jumpLine(1)
  doc
    .font('./assets/fonts/dobkin-script/dobkin-script.ttf')
    .fontSize(45)
    .fill(fontColors.green)
    .text('Development team', {
      lineGap: 10
    })
  doc
    .font('./assets/fonts/metropolis/metropolis-light.otf')
    .fontSize(14)
    .fill(fontColors.blue)
    .text('Has fully automated and optimised risk management very effectively throughout the organisation and can now demonstrate best practice for managing risks.', {
      lineGap: 10,
    })
  const logoMaxWidth = 120;
  const logoMaxHeight = 60;
  doc.image(
    './assets/images/ims-systems-logo-horizontal.png',
    doc.page.width / 2 - logoMaxWidth / 2,
    590,
    {
      fit: [logoMaxWidth, logoMaxHeight],
      align: 'center',
    }
  );
  const dateLineConfig = {
    strokeColor: fontColors.green,
    strokeOpacity: .8,
    lineSize: 100,
    lineStart: 83,
    startingHeight: 620,
    strokeWidth: 1,
    lineWidth: 1,
  }
  const dateLineEnd = dateLineConfig.lineStart + dateLineConfig.lineSize;
  doc.fillAndStroke(dateLineConfig.strokeColor);
  doc.strokeOpacity(dateLineConfig.strokeOpacity);
  doc
    .moveTo(dateLineConfig.lineStart, dateLineConfig.startingHeight)
    .lineTo(dateLineEnd, dateLineConfig.startingHeight)
    .lineWidth(dateLineConfig.strokeWidth)
    .stroke();
  const signLineConfig = {
    strokeColor: fontColors.green,
    strokeOpacity: .8,
    lineSize: 100,
    lineStart: 430,
    startingHeight: 620,
    strokeWidth: 1,
    lineWidth: 1,
  }
  const signLineEnd = signLineConfig.lineStart + signLineConfig.lineSize;
  doc.fillAndStroke(signLineConfig.strokeColor);
  doc.strokeOpacity(signLineConfig.strokeOpacity);
  doc
    .moveTo(signLineConfig.lineStart, signLineConfig.startingHeight)
    .lineTo(signLineEnd, signLineConfig.startingHeight)
    .lineWidth(signLineConfig.strokeWidth)
    .stroke();
  pdfHelper.jumpLine(15)
  doc
    .font('./assets/fonts/minion/minion-pro-medium.otf')
    .fontSize(10)
    .fill(fontColors.green)
    .text('iMS Technologies Ltd | Clive House, Clive Street, Bolton, BL1 1ET.', {
      align: 'center',
    })
  doc.font('./assets/fonts/playlist/playlist-script.otf').fill(fontColors.blue).fontSize(12).text('12/04/2022', 110, 600)
  doc.font('./assets/fonts/playlist/playlist-script.otf').fill(fontColors.blue).fontSize(12).text('N. Zamal', 450, 600)
  doc.font('./assets/fonts/minion/minion-pro-medium.otf').fill(fontColors.green).fontSize(12).text('Issue Date', 110, 630)
  doc.font('./assets/fonts/minion/minion-pro-medium.otf').fill(fontColors.green).fontSize(12).text('CEO, iMS Systems', 430, 630)
  doc.end();
}
build()