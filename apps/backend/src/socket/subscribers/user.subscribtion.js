const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const webSocket = require("../webSocket");
module.exports = function (client) {
  client.on("subscribe", (data) => {
    logger.info(`
      ${client.server.sockets.adapter.rooms},
      ${client.server.sockets.adapter.rooms.get(data.subscriptionFilter._id)}`
    );
    if (data.subscriptionFilter) {
      client.join(data.subscriptionFilter._id);
      webSocket
        .getSocket()
        .to(data.subscriptionFilter._id)
        .emit("subscription-response", data.subscriptionFilter);
      logger.info(
        `${data.subscriptionFilter.name} with uid: ${data.subscriptionFilter._id} has subscribed with scoket: ${client.id}`
      );
    }
  });
};
