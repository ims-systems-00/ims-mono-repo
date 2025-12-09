const eventsHandlers = {
  ...require("./handlers/incident-created"),
  ...require("./handlers/incident-escalated"),
  ...require("./handlers/incident-resolved"),
  ...require("./handlers/incident-ownership-changed"),
};
module.exports = eventsHandlers;
