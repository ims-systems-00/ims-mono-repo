const path = require("path");
const fs = require("fs").promises;

const libre = require("libreoffice-convert");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
libre.convertAsync = require("util").promisify(libre.convert);

async function main() {
  const ext = ".pdf";
  const inputPath = path.join(__dirname, "../../temp/test00.doc");
  const outputPath = path.join(__dirname, `../../temp/output${ext}`);
  const docxBuf = await fs.readFile(inputPath);
  let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
  await fs.writeFile(outputPath, pdfBuf);
}

main().catch(function (err) {
  logger.info(`Error converting file: ${err}`);
});
