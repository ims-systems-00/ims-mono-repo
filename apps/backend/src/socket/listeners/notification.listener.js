const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const webSocket = require("../webSocket");
module.exports = function (notification) {
  logger.info("Pushing notification...", notification);
  webSocket.isSet() &&
    webSocket
      .getSocket()
      .to(notification.user._id.toString())
      .emit("new-notification", notification);
};
