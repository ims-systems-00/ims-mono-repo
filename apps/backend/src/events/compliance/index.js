const eventsHandlers = {
  ...require("./handlers/control-became-compliant"),
  ...require("./handlers/control-linked"),
  ...require("./handlers/control-unlinked"),
};
module.exports = eventsHandlers;
