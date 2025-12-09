const eventsHandlers = {
  ...require("./handlers/risk-created"),
  ...require("./handlers/risk-escalated"),
  ...require("./handlers/risk-mitigated"),
  ...require("./handlers/risk-accepted"),
  ...require("./handlers/risk-ownership-changed"),
};
module.exports = eventsHandlers;
