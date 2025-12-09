const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const webSocket = require("../webSocket");
module.exports = function (data) {
  logger.info("Pushing signature list create information...");
  webSocket.isSet() &&
    webSocket
      .getSocket()
      .to(data.user._id.toString())
      .emit("new-document-signature-info", data);
};
