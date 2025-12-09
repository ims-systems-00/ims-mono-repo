const webSocket = require("../webSocket");
module.exports = function (client) {
  if (process.env.NODE_ENV !== "production")
    client.on("logger-subscription", (data) => {
      if (data.logKey) {
        client.join(process.env.LOGROOM);
        webSocket
          .getSocket()
          .to(process.env.LOGROOM)
          .emit("logger-subscription-response", { clientId: client.id });
      }
    });
};
