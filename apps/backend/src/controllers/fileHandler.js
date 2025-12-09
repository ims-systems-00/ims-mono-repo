const { asynchronously } = require("../services/utility");
const allowedPaths = process.env.ALLOWED_FILE_PATHS.split(",");
const FileHandlerService = require("../services/fileHandler");
const path = require("path");
const { fork } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const { FileManager } = require("../helpers/fileManager");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

exports.deleteFile = async (req, res, next) => {
  let fileManager = new FileManager(req.accessControl);
  try {
    let fileKey = decodeURI(req.header("x-file-key"));
    if (!fileKey)
      return res
        .status(400)
        .json({ message: "File not deleted. Please attach file key. " });
    let data = await fileManager.deleteFile({
      Bucket:
        process.env.NODE_ENV !== "production"
          ? process.env.AWS_TEST_BUCKET_NAME
          : req.accessControl.user.organizationId + process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
exports.getSignedUrl = async (req, res) => {
  let fileManager = new FileManager(req.accessControl);
  /**
   * we don not need to decode here because the headers of s3 bucket will be constructed here
   * so the string need to be kept encoded
   */
  let bucket = req.header("x-file-bucket");
  let key = req.header("x-file-key");
  let name = req.header("x-file-name");
  let [retrivalError, url] = await asynchronously(
    fileManager.getSingedUrlForView({
      Bucket: bucket,
      Name: name,
      Key: key,
    })
  );
  if (retrivalError || !url)
    return res
      .status(400)
      .json({ message: "Url retrival failed" + retrivalError.message });
  return res.status(200).json({ message: "Url retrival success", url });
};
exports.getUploadUrl = async (req, res, next) => {
  try {
    const key = decodeURI(req.header("x-file-key"));
    const path = decodeURI(req.header("x-file-path"));
    const ispublic = decodeURI(req.header("x-file-public"));
    const keySplited = key?.split("/");
    const originalFilename = keySplited[keySplited.length - 1];
    const fileManager = new FileManager();
    const Bucket =
      ispublic === process.env.AWS_PUBLIC_BUCKET_NAME
        ? process.env.AWS_PUBLIC_BUCKET_NAME
        : process.env.NODE_ENV !== "production"
        ? process.env.AWS_TEST_BUCKET_NAME
        : req.accessControl.user.organizationId + process.env.AWS_BUCKET_NAME;
    const response = await fileManager.generateUploadUrl(
      Bucket,
      originalFilename
    );
    res.status(200).json({
      message: "Url processing success",
      url: response.uploadUrl,
      uploadInformation: {
        Name: response.metaInfo.Name,
        Bucket: response.metaInfo.Bucket,
        Key: response.metaInfo.Key,
        key: response.metaInfo.Key,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Url retrival failed" + error.message });
  }
};
exports.getDocumentPreview = async (req, res) => {
  let fileManager = new FileHandlerService(req.accessControl);
  let Bucket = decodeURI(req.header("x-file-bucket"));
  let Key = decodeURI(req.header("x-file-key"));
  let process = fork(
    path.resolve(__dirname + "/../subprocess/fileConverter.js")
  );
  process.send({ Bucket, Key, accessControl: req.accessControl });
  process.on("message", (message) => {
    logger.info("file preparaed: ", { message });
    let file = message?.result?.originalResponse;
    let preparedFile = message?.result?.preparationResponse;
    if (!file || !preparedFile)
      return res.status(400).json({ message: "Could not convert files." });
    res
      .status(200)
      .sendFile(path.resolve(__dirname, `../../temp/${preparedFile.fileName}`));
    process.kill(message?.pid);
    let filesToBeDeleted = [file, preparedFile];
    res.on("finish", async function () {
      await Promise.all(
        filesToBeDeleted.map((file) => fileManager.removeTemporary(file))
      );
    });
    process.kill("SIGINT");
  });
};
