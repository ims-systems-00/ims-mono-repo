const { FileManager } = require("../helpers/fileManager");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
let prepareDocumentPreview = async ({ Bucket, Key, accessControl }) => {
  try {
    let connection = accessControl;
    let fileManager = new FileManager(connection);
    let file = await fileManager.saveTemporaryAsync({
      Key,
      Bucket,
    });
    let preparedFile = await fileManager.preparePdfPreview(file);
    return {
      originalResponse: file,
      preparationResponse: preparedFile,
    };
  } catch (err) {
    logger.error(err.message, err);
  }
};
process.on("message", async (message) => {
  let result = await prepareDocumentPreview(message);
  process.send({
    message: "File converted",
    result,
    pid: message?.pid,
  });
});
