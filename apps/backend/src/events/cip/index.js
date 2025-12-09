const eventsHandlers = {
  ...require("./handlers/cip-created"),
  ...require("./handlers/cip-in-progress"),
  ...require("./handlers/cip-implemented"),
  ...require("./handlers/cip-ownership-changed"),
};
module.exports = eventsHandlers;
