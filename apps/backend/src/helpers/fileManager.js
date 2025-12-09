const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Upload } = require("@aws-sdk/lib-storage");
const { APIError } = require("../helpers/errors/apiError");
const { s3Client } = require("../config/awsS3");
const fs = require("fs");
const path = require("path");
const fsPromise = fs.promises;
const libre = require("libreoffice-convert");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
libre.convertAsync = require("util").promisify(libre.convert);

class FileManager {
  constructor(connection) {
    this.connection = connection;
  }
  _isValidFile(filename) {
    return true;
    const validExtensions = [".jpg", ".png", ".jpeg"];
    let flag = false;
    validExtensions.forEach((ext) => {
      if (filename?.endsWith(ext)) flag = true;
    });
    return flag;
  }
  async storeInS3(Bucket, file) {
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: { Bucket, Key: file.name, Body: file.data },
    });
    parallelUploads3.on("httpUploadProgress", (progress) => {
      logger.info(progress);
    });
    return parallelUploads3.done();
  }
  async generateUploadUrl(bucket, filename) {
    if (!this._isValidFile(filename))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "A valid file name is required."
      );
    const filenameSplited = filename?.split("/");
    const originalFilename = filenameSplited[filenameSplited.length - 1];
    const originalFilenameSplited = originalFilename?.split(".");
    const fileName = `${uuidv4()}.${
      originalFilenameSplited[originalFilenameSplited.length - 1]
    }`;
    const params = {
      Bucket: bucket,
      Key: fileName,
    };
    const uploadUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand(params),
      {
        expiresIn: 3 * 3600,
      }
    );
    return {
      uploadUrl,
      metaInfo: {
        Name: originalFilename,
        ...params,
      },
    };
  }
  async getSingedUrlForView(fileinformation, options) {
    const params = {
      Bucket: fileinformation.Bucket,
      Key: fileinformation.Key,
    };
    const signedLink = await getSignedUrl(
      s3Client,
      new GetObjectCommand(params),
      {
        expiresIn: options?.expiresIn || 12 * 3600,
      }
    );
    return signedLink;
  }
  async deleteFile(fileinformation) {
    const params = {
      Bucket: fileinformation.Bucket,
      Key: fileinformation.Key,
    };
    const command = new DeleteObjectCommand(params);
    const response = await s3Client.send(command);
    return fileinformation;
  }
  async saveTemporaryAsync(fileData) {
    const params = {
      Bucket: fileData.Bucket,
      Key: fileData.Key,
    };
    let fileContent = await s3Client.send(new GetObjectCommand(params));
    let fileKey = fileData.Key || fileData.key;
    let splited = fileKey.split("/");
    let fileName = uuidv4() + "-" + splited[splited.length - 1];
    let filePath = `./temp/${fileName}`;
    await fsPromise.writeFile(filePath, fileContent.Body);
    return { fileName, path: filePath };
  }
  async saveTemporarySync(fileData) {
    const params = {
      Bucket: fileData.Bucket,
      Key: fileData.Key,
    };
    let fileContent = await s3Client.send(new GetObjectCommand(params));
    let fileKey = fileData.Key || fileData.key;
    let splited = fileKey.split("/");
    let fileName = splited[splited.length - 1];
    let filePath = `./temp/${fileName}`;
    fs.writeFileSync(filePath, fileContent.Body, (err) => {
      if (err) logger.info(err);
      else logger.info(`\nFile saved in temp folder: ${filePath}`);
    });
    return { fileName, path: filePath };
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
    if (extension === "pdf") return file;
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
      return {
        fileName: generatedFileName,
        path: `./temp/${generatedFileName}`,
      };
    }
    throw new Error("File preview not supported for this format");
  }
  removeTemporary(document) {
    fs.unlink(document.path.toString(), (err) => {
      if (err) logger.info("temp file delete error: " + err.message, err);
      else logger.info(`\nDeleted file: ${document.path}`);
    });
  }
}
module.exports = { FileManager };
