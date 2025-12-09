const libre = require("libreoffice-convert");
libre.convertAsync = require("util").promisify(libre.convert);
const fs = require("fs");
const fsPromise = fs.promises;
const path = require("path");
let { Parser } = require("json2csv");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

class FileHandlerService {
  constructor(connection) {
    this.connection = connection;
  }
  removeTemporary(document) {
    fs.unlink(document.path.toString(), (err) => {
      if (err) logger.info(err);
      else logger.info(`\nDeleted file: ${document.path}`);
    });
  }
  async preparePdfPreview(file) {
    if (!file) throw new Error("File is required");
    let splited = file.fileName.split(".");
    let extension = splited[splited.length - 1];
    extension = extension?.toString();
    const convertableOfficeFormats = [
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "csv",
    ];
    if (extension === "pdf") return [null, file];
    if (convertableOfficeFormats.includes(extension)) {
      const ext = ".pdf";
      const generatedFileName = `${splited
        .slice(0, splited.length - 1)
        .join("")}${ext}`;
      const inputPath = path.join(__dirname, `../../temp/${file.fileName}`);
      const outputPath = path.join(
        __dirname,
        `../../temp/${generatedFileName}`
      );
      const fileBuffer = await fsPromise.readFile(inputPath);
      const pdfBuffer = await libre.convertAsync(fileBuffer, ext, undefined); // undefined in third arg means no filter
      await fsPromise.writeFile(outputPath, pdfBuffer);
      return [
        null,
        {
          fileName: generatedFileName,
          path: `./temp/${generatedFileName}`,
        },
      ];
    }
    return [{ message: "File preview not supported for this format" }, null];
  }
  csvGenerator(fields, data) {
    return new Promise((resolve, reject) => {
      const json2csv = new Parser({ fields });
      let csv = json2csv.parse(data);
      let date = new Date();
      let filePath = `./temp/report-${date.toDateString()}.csv`;
      fs.writeFile(filePath, csv, (err) => {
        if (err) {
          logger.info(err);
          reject(err);
        } else {
          logger.info(`\nFile saved in temp folder: ${filePath}`);
          resolve({
            file: path.join(__dirname, "../../" + filePath),
            path: filePath,
          });
        }
      });
    });
  }
}

module.exports = FileHandlerService;
