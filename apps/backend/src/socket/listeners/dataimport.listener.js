const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const webSocket = require("../webSocket");
module.exports = function (data) {
  logger.info("Pushing data-import information...");
  webSocket.isSet() &&
    webSocket
      .getSocket()
      .to(data.user._id.toString())
      .emit("new-validated-row-info", data);
};
