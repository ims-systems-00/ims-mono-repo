const webSocket = require("../webSocket");
module.exports = function (...args) {
  if (process.env.NODE_ENV !== "production")
    webSocket.isSet() &&
      webSocket
        .getSocket()
        .to(process.env.LOGROOM)
        .emit("log-stream", [...args]);
};